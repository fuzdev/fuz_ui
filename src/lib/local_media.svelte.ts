/**
 * One local source, the mic, the camera, or the screen, turned on and off
 * as reactive state.
 *
 * **Off releases the device.** `stop` stops every track, so the browser's
 * recording indicator goes out, and `start` acquires it again. Nothing is
 * held muted in between.
 *
 * **`live` means heard.** A mic's track arrives before its device delivers
 * sound: on a phone, about 0.4 s to the track and about 0.56 s to the first
 * non-silent sample. So a mic stays `starting` until a light RMS probe reads
 * a sample above digital silence, and only then reads `live`, so a UI never
 * claims someone is heard before they are. The track is available from the
 * moment it arrives (`starting`), so a call can send it at once. A camera or
 * screen is `live` as soon as its track arrives.
 *
 * **`silent` means not heard yet, for a while.** A mic that sends only
 * digital silence (an OS-level mute, a hardware privacy switch, a virtual
 * device sending zeros) stays `starting` for good. Once its track has been
 * sendable for `LOCAL_MEDIA_SILENT_AFTER` with nothing heard, `silent` is
 * true, so a UI can say so; the probe keeps listening, and the first sample
 * heard makes the mic `live` and clears `silent`.
 *
 * @module
 */

import { create_stream_level_probe, type AudioLevelProbe } from './audio_level.svelte.ts';
import {
	media_access_error_message,
	to_media_access_error,
	type MediaAccessError
} from './media_errors.ts';

/** A local source of media. */
export type LocalMediaKind = 'mic' | 'camera' | 'screen';

/**
 * Where a source is: `off` holds no device, `starting` is acquiring it (or,
 * for a mic, has it but hasn't heard it yet), `live` is delivering.
 */
export type LocalMediaStatus = 'off' | 'starting' | 'live';

/** The browser a `LocalMedia` runs in, so a test can stand in for its devices and clock. */
export interface LocalMediaDeps {
	/** `navigator.mediaDevices.getUserMedia`, or `null` where there's no API. */
	get_user_media: ((constraints: MediaStreamConstraints) => Promise<MediaStream>) | null;
	/** `navigator.mediaDevices.getDisplayMedia`, or `null` where there's no API. */
	get_display_media: ((options: DisplayMediaStreamOptions) => Promise<MediaStream>) | null;
	/**
	 * A probe on a fresh mic stream, to hear its first non-silent sample, or
	 * `null` where the level can't be measured (the mic is then `live` as
	 * soon as its track arrives). Share the page's `AudioContext` when it has
	 * one: an analyser in a suspended context reads silence, so the mic would
	 * stay `starting` and read `silent`.
	 */
	create_level_probe: ((stream: MediaStream) => AudioLevelProbe) | null;
	/** Calls `fn` every `ms` until the returned stop is called (`setInterval`). */
	repeat: (fn: () => void, ms: number) => () => void;
	/** Calls `fn` once after `ms` unless the returned cancel is called first (`setTimeout`). */
	timeout: (fn: () => void, ms: number) => () => void;
}

/**
 * `LocalMediaDeps` over the given `MediaDevices`, by default the page's. Its
 * level probe opens an `AudioContext` of its own per mic start and closes it
 * once the mic is heard; pass `create_level_probe` over a shared context
 * instead when the page has one.
 *
 * @param media_devices - `navigator.mediaDevices`, missing on insecure pages
 */
export const create_local_media_deps = (
	media_devices: MediaDevices | undefined = globalThis.navigator?.mediaDevices
): LocalMediaDeps => ({
	get_user_media: media_devices?.getUserMedia
		? (constraints) => media_devices.getUserMedia(constraints)
		: null,
	get_display_media: media_devices?.getDisplayMedia
		? (options) => media_devices.getDisplayMedia(options)
		: null,
	create_level_probe:
		typeof AudioContext === 'undefined'
			? null
			: (stream) => {
					const context = new AudioContext();
					// allowed without a gesture while the page is capturing
					void context.resume().catch(() => {});
					const probe = create_stream_level_probe(context, stream);
					return {
						read: probe.read,
						close: () => {
							probe.close();
							void context.close().catch(() => {});
						}
					};
				},
	repeat: (fn, ms) => {
		const timer = setInterval(fn, ms);
		return () => clearInterval(timer);
	},
	timeout: (fn, ms) => {
		const timer = setTimeout(fn, ms);
		return () => clearTimeout(timer);
	}
});

/**
 * RMS above which a mic's sample counts as heard, about -100 dBFS: below
 * any real mic's noise floor, so only the digital silence a device sends
 * before it starts reads lower.
 */
export const LOCAL_MEDIA_HEARD_RMS = 0.00001;

/** How often a starting mic's probe is read, in milliseconds. */
export const LOCAL_MEDIA_PROBE_INTERVAL = 20;

/**
 * How long a mic's track may be sendable with nothing heard before it reads
 * `silent`, in milliseconds. The measured gap from a phone's track to its
 * first non-silent sample is about 0.16 s (0.4 s to the track, 0.56 s to
 * the sample), so 2 s is over ten times that: room for a slower device,
 * such as a Bluetooth headset switching to its call profile, while still
 * soon enough to tell someone why nobody hears them.
 */
export const LOCAL_MEDIA_SILENT_AFTER = 2000;

/** Default words for a `silent` mic, neutral since the mic may yet start. */
export const LOCAL_MEDIA_SILENT_MESSAGE = 'No sound from your mic yet.';

export interface LocalMediaOptions {
	kind: LocalMediaKind;
	/** @default create_local_media_deps() */
	deps?: LocalMediaDeps;
	/**
	 * The mic's or camera's track constraints, read at each `start`, so a
	 * device picked since is used: typically
	 * `{deviceId: devices.to_device_constraint('audioinput')}`.
	 */
	track_constraints?: () => MediaTrackConstraints;
	/**
	 * The screen picker's options, read at each `start`.
	 * @default () => ({video: true, audio: false})
	 */
	display_options?: () => DisplayMediaStreamOptions;
	/**
	 * The RMS above which a mic's sample counts as heard.
	 * @default LOCAL_MEDIA_HEARD_RMS
	 */
	heard_rms?: number;
	/**
	 * How long a mic's track may be sendable with nothing heard before it
	 * reads `silent`, in milliseconds.
	 * @default LOCAL_MEDIA_SILENT_AFTER
	 */
	silent_after?: number;
}

/**
 * One local source, off until `start`, released by `stop`. Call `start`
 * from a click: browsers ask for the permission then, and the screen picker
 * opens only during a gesture.
 */
export class LocalMedia {
	readonly kind: LocalMediaKind;
	readonly deps: LocalMediaDeps;

	status: LocalMediaStatus = $state.raw('off');

	/** The acquired stream, from the track's arrival until the source is off. */
	stream: MediaStream | null = $state.raw(null);

	/**
	 * The source's main track: the audio track for a mic, the video track for
	 * a camera or screen. Set while `starting` too, once acquired.
	 */
	readonly track: MediaStreamTrack | null = $derived.by(() => {
		if (!this.stream) return null;
		const tracks =
			this.kind === 'mic' ? this.stream.getAudioTracks() : this.stream.getVideoTracks();
		return tracks[0] ?? null;
	});

	/** The device the track actually opened, which may differ from the pick. */
	device_id: string | null = $state.raw(null);

	/**
	 * Whether the browser muted the live track at its source: an OS mute
	 * switch, or on a phone, a call taking the mic.
	 */
	track_muted: boolean = $state.raw(false);

	/**
	 * Whether a `starting` mic's track has been sendable for `silent_after`
	 * with no sample heard: likely muted outside the browser, or sending
	 * only digital silence. It stays `starting`, and the first sample heard
	 * makes it `live` and clears this. Default words:
	 * `LOCAL_MEDIA_SILENT_MESSAGE`.
	 */
	silent: boolean = $state.raw(false);

	/** Why the last start failed or the track ended, cleared by the next `start`. */
	error: MediaAccessError | null = $state.raw(null);

	/** Whether the source is on or turning on: anything but `off`, for an indicator. */
	readonly active: boolean = $derived(this.status !== 'off');

	#get_track_constraints: (() => MediaTrackConstraints) | undefined;
	#get_display_options: () => DisplayMediaStreamOptions;
	#heard_rms: number;
	#silent_after: number;
	/** Bumped by each `start` and `stop`, so a start that settles late knows it was superseded. */
	#generation = 0;
	/** Ends the probe `#probe_until_heard` started: its reads, its `silent` timer, the probe. */
	#end_probe_fn: (() => void) | null = null;
	#unlisten_track: (() => void) | null = null;

	constructor(options: LocalMediaOptions) {
		this.kind = options.kind;
		this.deps = options.deps ?? create_local_media_deps();
		this.#get_track_constraints = options.track_constraints;
		this.#get_display_options = options.display_options ?? (() => ({ video: true, audio: false }));
		this.#heard_rms = options.heard_rms ?? LOCAL_MEDIA_HEARD_RMS;
		this.#silent_after = options.silent_after ?? LOCAL_MEDIA_SILENT_AFTER;
	}

	/**
	 * Acquires the device. A no-op unless `off`. Resolves once the track has
	 * arrived or the start failed (see `error`); a mic may still be
	 * `starting` then, until it's heard.
	 */
	async start(): Promise<void> {
		if (this.status !== 'off') return;
		const generation = ++this.#generation;
		this.error = null;
		const acquire = this.#to_acquire();
		if (!acquire) {
			this.error = to_media_access_error({ name: 'NotSupportedError' }, this.kind);
			return;
		}
		this.status = 'starting';
		let stream: MediaStream;
		try {
			stream = await acquire();
		} catch (error) {
			if (generation !== this.#generation) return;
			this.error = to_media_access_error(error, this.kind);
			this.status = 'off';
			return;
		}
		if (generation !== this.#generation) {
			// stopped while the permission prompt or picker was up
			stop_tracks(stream);
			return;
		}
		this.stream = stream;
		const track = this.track;
		this.device_id = track?.getSettings().deviceId ?? null;
		this.track_muted = track?.muted ?? false;
		if (track) this.#listen_track(track);
		if (this.kind === 'mic' && track && this.deps.create_level_probe) {
			this.#probe_until_heard(stream, this.deps.create_level_probe);
		} else {
			this.status = 'live';
		}
	}

	/** Releases the device: every track stopped, the indicator out. Abandons a start under way. */
	stop(): void {
		this.#generation++;
		this.#release();
	}

	/** Starts when off, stops otherwise. */
	async toggle(): Promise<void> {
		if (this.status === 'off') {
			await this.start();
		} else {
			this.stop();
		}
	}

	/**
	 * Re-acquires an active source with fresh constraints, for a newly picked
	 * device. A no-op while off. It passes through `off`, releasing the old
	 * device before asking for the new one (break-before-make, which iOS
	 * wants, since it lets a page hold only one capture of a kind at once). A
	 * failed start leaves the source `off` with `error` set.
	 */
	async restart(): Promise<void> {
		if (this.status === 'off') return;
		this.stop();
		await this.start();
	}

	#to_acquire(): (() => Promise<MediaStream>) | null {
		if (this.kind === 'screen') {
			const get_display_media = this.deps.get_display_media;
			if (!get_display_media) return null;
			return () => get_display_media(this.#get_display_options());
		}
		const get_user_media = this.deps.get_user_media;
		if (!get_user_media) return null;
		const constraints = this.#get_track_constraints?.() ?? true;
		return () =>
			get_user_media(this.kind === 'mic' ? { audio: constraints } : { video: constraints });
	}

	#probe_until_heard(
		stream: MediaStream,
		create_level_probe: (stream: MediaStream) => AudioLevelProbe
	): void {
		let probe: AudioLevelProbe;
		try {
			probe = create_level_probe(stream);
		} catch {
			// can't measure it, so don't hold it back
			this.status = 'live';
			return;
		}
		const stop_probing = this.deps.repeat(() => {
			if (probe.read() <= this.#heard_rms) return;
			this.#end_probe();
			this.status = 'live';
		}, LOCAL_MEDIA_PROBE_INTERVAL);
		// cancelled with the probe, so it fires only while this probe still listens
		const cancel_silent = this.deps.timeout(() => {
			this.silent = true;
		}, this.#silent_after);
		this.#end_probe_fn = () => {
			stop_probing();
			cancel_silent();
			probe.close();
		};
	}

	#end_probe(): void {
		this.#end_probe_fn?.();
		this.#end_probe_fn = null;
		this.silent = false;
	}

	#listen_track(track: MediaStreamTrack): void {
		const on_ended = (): void => {
			// the browser's own "stop sharing" ends a screen track, which isn't a failure
			const error =
				this.kind === 'screen'
					? null
					: {
							reason: 'ended' as const,
							kind: this.kind,
							name: null,
							message: media_access_error_message('ended', this.kind)
						};
			this.stop();
			this.error = error;
		};
		const on_mute = (): void => {
			this.track_muted = true;
		};
		const on_unmute = (): void => {
			this.track_muted = false;
		};
		track.addEventListener('ended', on_ended);
		track.addEventListener('mute', on_mute);
		track.addEventListener('unmute', on_unmute);
		this.#unlisten_track = () => {
			track.removeEventListener('ended', on_ended);
			track.removeEventListener('mute', on_mute);
			track.removeEventListener('unmute', on_unmute);
		};
	}

	#release(): void {
		this.#end_probe();
		this.#unlisten_track?.();
		this.#unlisten_track = null;
		if (this.stream) stop_tracks(this.stream);
		this.stream = null;
		this.device_id = null;
		this.track_muted = false;
		this.status = 'off';
	}
}

/** Stops every track, which is what releases the device. */
const stop_tracks = (stream: MediaStream): void => {
	for (const track of stream.getTracks()) track.stop();
};
