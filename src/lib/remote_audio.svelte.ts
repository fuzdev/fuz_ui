/**
 * Plays the remote streams of a call through one `AudioContext`, with a
 * volume and mute per stream.
 *
 * **Why one context, unlocked in a click.** A phone's browser plays audio
 * only once a gesture has allowed it. A fresh `<audio>` per peer can't play
 * a peer who arrives later, with no tap in between: its `play()` is refused.
 * One context resumed inside a click (`unlock`, in the Join handler) plays
 * every stream routed into it afterwards, however late it arrives. So each
 * stream goes `MediaStreamAudioSourceNode` → its own `GainNode` → the
 * output, and nothing plays through a per-peer element.
 *
 * **The helper element.** Chromium pulls a remote WebRTC stream into Web
 * Audio only while a media element holds it, so each stream also gets a
 * muted `<audio>` that plays nothing anyone hears. Safari doesn't need it
 * and isn't harmed by it; `helper_elements: false` drops it.
 *
 * **Suspended again.** A phone call or backgrounding the page suspends the
 * context (`suspended`, or `interrupted` where the browser says so), and only
 * a later gesture is sure to resume it. `needs_resume` is then true, for a
 * quiet "tap to hear the room" that calls `resume` from its click.
 *
 * **Output device.** `set_output` uses `AudioContext.setSinkId` where the
 * browser has it, routes through an element where only media elements take a
 * sink, and otherwise stays on the default output (`can_choose_output` is
 * then false). See `audio_output.ts`.
 *
 * @module
 */

import { SvelteMap, SvelteSet } from 'svelte/reactivity';
import { noop } from '@fuzdev/fuz_util/function.ts';
import type { Result } from '@fuzdev/fuz_util/result.ts';

import { create_audio_level_probe, type AudioLevelProbe } from './audio_level.svelte.ts';
import {
	can_choose_audio_output,
	create_audio_output,
	type AudioOutput,
	type AudioOutputRoute
} from './audio_output.ts';
import { to_media_access_error, type MediaAccessError } from './media_errors.ts';

/**
 * Where playback is: `locked` until the first `unlock`, `running` while it
 * plays, `suspended` or `interrupted` when the browser paused it, `closed`
 * after `close`, or once the browser closed the context, which only the next
 * `unlock` replaces (`needs_resume` stays false).
 */
export type RemoteAudioStatus = 'locked' | 'running' | 'suspended' | 'interrupted' | 'closed';

/** The browser a `RemoteAudio` plays in, so a test can stand in for Web Audio. */
export interface RemoteAudioDeps {
	/** `new AudioContext()`. Called inside `unlock`, so inside the click. */
	create_audio_context: () => AudioContext;
	/** `new Audio()`, for the helper elements and the element output route. */
	create_audio_element: () => HTMLAudioElement;
	/** Whether any output route can reach a chosen device (`can_choose_audio_output`). */
	can_choose_output: () => boolean;
}

/** `RemoteAudioDeps` over the real browser, each global read when it's called. */
export const create_remote_audio_deps = (): RemoteAudioDeps => ({
	create_audio_context: () => new AudioContext({ latencyHint: 'interactive' }),
	create_audio_element: () => new Audio(),
	can_choose_output: can_choose_audio_output
});

export interface RemoteAudioOptions {
	/** @default create_remote_audio_deps() */
	deps?: RemoteAudioDeps;
	/**
	 * Whether each stream also gets a muted helper `<audio>`, which Chromium
	 * needs to deliver remote WebRTC audio into Web Audio.
	 * @default true
	 */
	helper_elements?: boolean;
}

/** What `RemoteAudio.set_output` got. */
export type RemoteAudioOutputResult = Result<object, { error: MediaAccessError }>;

interface RemoteAudioEntry {
	id: string;
	stream: MediaStream;
	element: HTMLAudioElement | null;
	source: MediaStreamAudioSourceNode | null;
	gain: GainNode | null;
	probe: AudioLevelProbe | null;
	unlisten: () => void;
}

/**
 * The remote half of a call's audio. Construct it anywhere (it touches no
 * browser API until `unlock`), call `unlock` from the click that joins, then
 * `add` each remote stream as it arrives and `remove` it when it leaves.
 * Streams added before `unlock` start playing at `unlock`.
 */
export class RemoteAudio {
	readonly deps: RemoteAudioDeps;

	status: RemoteAudioStatus = $state.raw('locked');

	/**
	 * Whether the browser paused playback and a gesture should resume it:
	 * show a prompt whose click calls `resume`.
	 */
	readonly needs_resume: boolean = $derived(
		this.status === 'suspended' || this.status === 'interrupted'
	);

	/**
	 * The context, from the first `unlock` until `close`. Share it with level
	 * probes and anything else that belongs on the call's graph, reading it
	 * each time: a context the browser closed is replaced at the next
	 * `unlock`, so a `LocalMedia` probing on it must be rebuilt after a
	 * close, or it reads silence.
	 */
	context: AudioContext | null = $state.raw(null);

	/** Whether this browser can choose an output device at all. */
	readonly can_choose_output: boolean;

	/** The output device in effect (or to apply at `unlock`), the empty string for the default. */
	output_device_id: string = $state.raw('');

	/** How sound reaches the output device. */
	output_route: AudioOutputRoute = $state.raw('default');

	/** Why the last output change failed, cleared by the next one that works. */
	output_error: MediaAccessError | null = $state.raw(null);

	#helper_elements: boolean;
	#entries: Map<string, RemoteAudioEntry> = new Map();
	#volumes: SvelteMap<string, number> = new SvelteMap();
	#muted: SvelteSet<string> = new SvelteSet();
	#output: AudioOutput | null = null;
	#output_generation = 0;
	#unlisten_context: (() => void) | null = null;

	constructor(options?: RemoteAudioOptions) {
		this.deps = options?.deps ?? create_remote_audio_deps();
		this.#helper_elements = options?.helper_elements ?? true;
		this.can_choose_output = this.deps.can_choose_output();
	}

	/**
	 * Opens the context if there isn't one, and resumes it. Call it
	 * synchronously from a click (the Join handler), before any `await`: the
	 * browser allows playback only inside the gesture. Resolves once the
	 * browser has answered; `status` says how, and stays as it was until
	 * then. A context the browser closed is replaced by a fresh one, with
	 * every stream and the output device carried over.
	 */
	unlock(): Promise<void> {
		// a context the browser closed under us can't resume: open a fresh one,
		// keeping the streams, which `#open_context` wires into it
		if (this.context?.state === 'closed') this.#detach_context();
		const context = this.context ?? this.#open_context();
		return this.#resume(context);
	}

	/**
	 * Resumes a paused context from a later gesture, as `needs_resume` asks.
	 * Does nothing before the first `unlock` or after `close`, so a stray
	 * prompt can't start playback early. Also safe to try without a gesture
	 * (on returning to the page): some browsers allow it, and the rest leave
	 * `needs_resume` set.
	 */
	async resume(): Promise<void> {
		if (!this.context) return;
		await this.#resume(this.context);
	}

	/**
	 * Plays `stream` under `id`, typically a member's id. A new stream under
	 * a known id replaces the old one and keeps its volume and mute. A stream
	 * with no audio track yet is wired when one arrives (`addtrack`).
	 */
	add(id: string, stream: MediaStream): void {
		const existing = this.#entries.get(id);
		if (existing) {
			if (existing.stream === stream) return;
			this.#drop(existing);
		}
		const entry: RemoteAudioEntry = {
			id,
			stream,
			element: null,
			source: null,
			gain: null,
			probe: null,
			unlisten: noop
		};
		if (this.#helper_elements) {
			const element = this.deps.create_audio_element();
			element.muted = true;
			element.srcObject = stream;
			// muted playback is always allowed; a refusal only costs Chromium's pull
			element.play().catch(noop);
			entry.element = element;
		}
		const on_addtrack = (): void => this.#wire(entry);
		stream.addEventListener('addtrack', on_addtrack);
		entry.unlisten = () => stream.removeEventListener('addtrack', on_addtrack);
		this.#entries.set(id, entry);
		this.#wire(entry);
	}

	/** Stops playing `id`'s stream, disconnecting its nodes. Its volume and mute are kept. */
	remove(id: string): void {
		const entry = this.#entries.get(id);
		if (!entry) return;
		this.#drop(entry);
		this.#entries.delete(id);
	}

	/** Whether a stream is playing, or waiting to, under `id`. */
	has(id: string): boolean {
		return this.#entries.has(id);
	}

	/** Removes every stream, keeping the context unlocked for the next call. */
	clear(): void {
		for (const entry of this.#entries.values()) this.#drop(entry);
		this.#entries.clear();
	}

	/** `id`'s volume, 1 unless set. Reactive. */
	get_volume(id: string): number {
		return this.#volumes.get(id) ?? 1;
	}

	/**
	 * Sets `id`'s volume, 0 and up (1 as sent, above 1 louder), for now and
	 * for any later stream under `id`.
	 */
	set_volume(id: string, volume: number): void {
		const value = Number.isFinite(volume) ? Math.max(0, volume) : 1;
		this.#volumes.set(id, value);
		this.#apply_gain(id);
	}

	/** Whether `id` is muted here. Reactive. */
	is_muted(id: string): boolean {
		return this.#muted.has(id);
	}

	/** Mutes or unmutes `id` here only, keeping its volume for the unmute. */
	set_muted(id: string, muted: boolean): void {
		if (muted) {
			this.#muted.add(id);
		} else {
			this.#muted.delete(id);
		}
		this.#apply_gain(id);
	}

	/**
	 * `id`'s level now, as RMS from 0 to 1, read before its volume and mute,
	 * so a speaking indicator shows someone muted here too. 0 for an unknown
	 * id, a stream not yet wired, or a paused context. Pair it with an
	 * `AudioLevelState` for a reactive indicator.
	 */
	read_level(id: string): number {
		const entry = this.#entries.get(id);
		if (!entry?.source) return 0;
		entry.probe ??= create_audio_level_probe(entry.source);
		return entry.probe.read();
	}

	/**
	 * Sends the call to the output device `device_id`, the empty string for
	 * the default. Before `unlock`, or after the browser closed the context,
	 * it's kept and applied at the next `unlock`. A failure
	 * keeps the output that was in effect and sets `output_error`.
	 */
	async set_output(device_id: string): Promise<RemoteAudioOutputResult> {
		const generation = ++this.#output_generation;
		const context = this.context;
		// before `unlock`, or once the browser closed the context, the next
		// `unlock` applies it
		if (!context || context.state === 'closed') {
			this.output_device_id = device_id;
			this.output_error = null;
			return { ok: true };
		}
		return this.#apply_output(context, device_id, generation);
	}

	/**
	 * Stops everything: the streams, the output route, and the context.
	 * Volumes and mutes are kept, and a later `unlock` opens a fresh context.
	 */
	close(): void {
		this.clear();
		const context = this.#detach_context();
		if (context) void context.close().catch(noop);
		this.status = 'closed';
	}

	/**
	 * Lets go of the context, the streams' nodes in it, and its output route,
	 * returning the context. The streams are kept, for `#open_context` to wire
	 * into the next one.
	 */
	#detach_context(): AudioContext | null {
		for (const entry of this.#entries.values()) this.#unwire(entry);
		this.#output_generation++;
		this.#output?.close();
		this.#output = null;
		this.output_route = 'default';
		this.#unlisten_context?.();
		this.#unlisten_context = null;
		const context = this.context;
		this.context = null;
		return context;
	}

	#open_context(): AudioContext {
		const context = this.deps.create_audio_context();
		this.context = context;
		// `status` waits for `#resume` (or a `statechange`): a fresh context is
		// `suspended` until then, which would flash `needs_resume` at every unlock
		const on_statechange = (): void => this.#sync_status(context);
		context.addEventListener('statechange', on_statechange);
		this.#unlisten_context = () => context.removeEventListener('statechange', on_statechange);
		for (const entry of this.#entries.values()) this.#wire(entry);
		if (this.output_device_id) {
			void this.#apply_output(context, this.output_device_id, ++this.#output_generation);
		}
		return context;
	}

	async #resume(context: AudioContext): Promise<void> {
		try {
			// called before the first `await`, so still inside the gesture
			await context.resume();
		} catch {
			// `status` reports what the browser left it in
		}
		if (this.context === context) this.#sync_status(context);
	}

	#sync_status(context: AudioContext): void {
		if (this.context !== context) return;
		// `interrupted` is newer than the lib types some consumers build with
		const state: string = context.state;
		this.status =
			state === 'running' || state === 'suspended' || state === 'interrupted' || state === 'closed'
				? state
				: 'suspended';
	}

	#wire(entry: RemoteAudioEntry): void {
		const context = this.context;
		if (!context || entry.source || !entry.stream.getAudioTracks().length) return;
		const source = context.createMediaStreamSource(entry.stream);
		const gain = context.createGain();
		gain.gain.value = this.#to_gain(entry.id);
		source.connect(gain);
		gain.connect(this.#output?.node ?? context.destination);
		entry.source = source;
		entry.gain = gain;
	}

	#drop(entry: RemoteAudioEntry): void {
		entry.unlisten();
		this.#unwire(entry);
		if (entry.element) {
			entry.element.pause();
			entry.element.srcObject = null;
			entry.element = null;
		}
	}

	/** Disconnects `entry`'s nodes, so `#wire` can build them again. */
	#unwire(entry: RemoteAudioEntry): void {
		entry.probe?.close();
		entry.probe = null;
		entry.source?.disconnect();
		entry.gain?.disconnect();
		entry.source = null;
		entry.gain = null;
	}

	#to_gain(id: string): number {
		return this.#muted.has(id) ? 0 : (this.#volumes.get(id) ?? 1);
	}

	#apply_gain(id: string): void {
		const gain = this.#entries.get(id)?.gain;
		if (gain) gain.gain.value = this.#to_gain(id);
	}

	async #apply_output(
		context: AudioContext,
		device_id: string,
		generation: number
	): Promise<RemoteAudioOutputResult> {
		const previous_device_id = this.#output ? this.output_device_id : '';
		let output: AudioOutput;
		try {
			output = await create_audio_output(context, device_id, {
				create_audio_element: this.deps.create_audio_element
			});
		} catch (thrown) {
			const error = to_media_access_error(thrown, 'output');
			if (generation === this.#output_generation && this.context === context) {
				this.output_device_id = previous_device_id;
				this.output_error = error;
			}
			return { ok: false, error };
		}
		if (generation !== this.#output_generation || this.context !== context) {
			// a later change, or a close, owns the output now
			output.close();
			return { ok: false, error: to_media_access_error({ name: 'AbortError' }, 'output') };
		}
		const previous = this.#output;
		this.#output = output;
		if ((previous?.node ?? context.destination) !== output.node) {
			for (const entry of this.#entries.values()) {
				if (!entry.gain) continue;
				entry.gain.disconnect();
				entry.gain.connect(output.node);
			}
		}
		previous?.close();
		this.output_device_id = device_id;
		this.output_route = output.route;
		this.output_error = null;
		return { ok: true };
	}
}
