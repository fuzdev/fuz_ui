/**
 * The browser's media devices, its mic and camera permissions, and the
 * devices a person picked, as reactive state.
 *
 * Browsers hide device ids and labels until a permission is granted: before
 * that, `enumerateDevices` lists blank entries (Chromium, Firefox) or none
 * (Safari). So a picked device is a *preference*, kept while its device is
 * away (unplugged headphones come back as the pick), and
 * `to_device_constraint` asks for it as hard as the list can vouch for it.
 * Storing the picks is the consumer's: seed them with `initial_selection`
 * and save them from `on_select`.
 *
 * @module
 */

import type { Result } from '@fuzdev/fuz_util/result.ts';

import { to_media_access_error, type MediaAccessError } from './media_errors.ts';

/** A permission's state, or `unknown` where the browser can't say. */
export type MediaPermissionState = PermissionState | 'unknown';

/** The permissions `MediaDevicesState` reads. */
export type MediaPermissionName = 'microphone' | 'camera';

/** A picked device id per kind, the empty string for the browser's default. */
export interface MediaDeviceSelection {
	audioinput: string;
	videoinput: string;
	audiooutput: string;
}

/** The parts of a `PermissionStatus` that are read; a real one satisfies it. */
export interface MediaPermissionStatus extends EventTarget {
	readonly state: PermissionState;
}

/** The browser a `MediaDevicesState` reads, so a test can stand in for it. */
export interface MediaDevicesStateDeps {
	/** `navigator.mediaDevices.enumerateDevices`, or `null` where there's no API. */
	enumerate_devices: (() => Promise<Array<MediaDeviceInfo>>) | null;
	/** Listens for `devicechange`; returns the unlisten. */
	on_device_change: (listener: () => void) => () => void;
	/**
	 * `navigator.permissions.query`, resolving `null` where the browser can't
	 * query `name` (it throws, or there's no Permissions API).
	 */
	query_permission: (name: MediaPermissionName) => Promise<MediaPermissionStatus | null>;
	/**
	 * `navigator.mediaDevices.selectAudioOutput` (Firefox), which asks the
	 * person for an output it hasn't listed yet, or `null` where it's missing.
	 */
	select_audio_output: (() => Promise<MediaDeviceInfo>) | null;
}

/**
 * `MediaDevicesStateDeps` over the given platform objects, by default the
 * page's; each method is read when it's called.
 *
 * @param media_devices - `navigator.mediaDevices`, missing on insecure pages
 * @param permissions - `navigator.permissions`
 */
export const create_media_devices_state_deps = (
	media_devices: MediaDevices | undefined = globalThis.navigator?.mediaDevices,
	permissions: Permissions | undefined = globalThis.navigator?.permissions
): MediaDevicesStateDeps => {
	// widened, so a lib that types `selectAudioOutput` doesn't change the check
	const select_host = media_devices as
		(MediaDevices & { selectAudioOutput?: () => Promise<MediaDeviceInfo> }) | undefined;
	return {
		enumerate_devices: media_devices?.enumerateDevices
			? () => media_devices.enumerateDevices()
			: null,
		on_device_change: (listener) => {
			if (!media_devices) return () => {};
			media_devices.addEventListener('devicechange', listener);
			return () => media_devices.removeEventListener('devicechange', listener);
		},
		query_permission: async (name) => {
			if (!permissions) return null;
			try {
				return await permissions.query({ name });
			} catch {
				return null;
			}
		},
		select_audio_output: select_host?.selectAudioOutput
			? () => select_host.selectAudioOutput!()
			: null
	};
};

export interface MediaDevicesStateOptions {
	/** @default create_media_devices_state_deps() */
	deps?: MediaDevicesStateDeps;
	/** The picks to start from, typically loaded from storage. */
	initial_selection?: Partial<MediaDeviceSelection>;
	/** Called with every pick after it changes, to save it. */
	on_select?: (selection: MediaDeviceSelection) => void;
}

/** What `MediaDevicesState.pick_audio_output` got. */
export type AudioOutputPick = Result<{ device: MediaDeviceInfo }, { error: MediaAccessError }>;

/**
 * The devices on offer, the permissions, and the picks. Reads nothing until
 * `refresh` or `listen`, so it constructs during SSR.
 */
export class MediaDevicesState {
	readonly deps: MediaDevicesStateDeps;

	/** Whether the browser offers media devices here (a secure page with the API). */
	readonly supported: boolean;

	/** Every device the browser lists, in its order. */
	devices: Array<MediaDeviceInfo> = $state.raw([]);

	readonly audio_inputs: Array<MediaDeviceInfo> = $derived(
		this.devices.filter((d) => d.kind === 'audioinput')
	);
	readonly video_inputs: Array<MediaDeviceInfo> = $derived(
		this.devices.filter((d) => d.kind === 'videoinput')
	);
	readonly audio_outputs: Array<MediaDeviceInfo> = $derived(
		this.devices.filter((d) => d.kind === 'audiooutput')
	);

	microphone_permission: MediaPermissionState = $state.raw('unknown');
	camera_permission: MediaPermissionState = $state.raw('unknown');

	/** The picks, the empty string for the default. Change them with `select`. */
	selection: MediaDeviceSelection = $state.raw({ audioinput: '', videoinput: '', audiooutput: '' });

	/** Whether the browser can ask the person for an output (`selectAudioOutput`). */
	readonly can_pick_audio_output: boolean;

	#on_select: ((selection: MediaDeviceSelection) => void) | undefined;
	#refresh_generation = 0;
	#permission_generation = 0;
	#listen_count = 0;
	#unlisten_permissions: Array<() => void> = [];

	constructor(options?: MediaDevicesStateOptions) {
		this.deps = options?.deps ?? create_media_devices_state_deps();
		this.supported = !!this.deps.enumerate_devices;
		this.can_pick_audio_output = !!this.deps.select_audio_output;
		this.#on_select = options?.on_select;
		if (options?.initial_selection) {
			this.selection = { ...this.selection, ...options.initial_selection };
		}
	}

	/**
	 * Re-reads the device list. A refresh that finishes after a later one
	 * started is dropped, so the list is never older than the last call.
	 */
	async refresh_devices(): Promise<void> {
		const enumerate = this.deps.enumerate_devices;
		if (!enumerate) return;
		const generation = ++this.#refresh_generation;
		let devices: Array<MediaDeviceInfo>;
		try {
			devices = await enumerate();
		} catch {
			return;
		}
		if (generation === this.#refresh_generation) this.devices = devices;
	}

	/**
	 * Re-reads the mic and camera permissions. While listening, it also
	 * follows each status's `change` event.
	 */
	async refresh_permissions(): Promise<void> {
		const generation = ++this.#permission_generation;
		const [microphone, camera] = await Promise.all([
			this.deps.query_permission('microphone'),
			this.deps.query_permission('camera')
		]);
		if (generation !== this.#permission_generation) return;
		this.microphone_permission = microphone?.state ?? 'unknown';
		this.camera_permission = camera?.state ?? 'unknown';
		if (this.#listen_count === 0) return;
		this.#drop_permission_listeners();
		this.#follow_permission(microphone, (state) => (this.microphone_permission = state));
		this.#follow_permission(camera, (state) => (this.camera_permission = state));
	}

	/** Re-reads the devices and the permissions. */
	async refresh(): Promise<void> {
		await Promise.all([this.refresh_devices(), this.refresh_permissions()]);
	}

	/**
	 * Refreshes now and follows changes (`devicechange`, permission `change`)
	 * until the returned stop, for an `$effect` or `onMount`. A granted
	 * permission reveals labels, so the devices are re-read with it. Several
	 * components may listen at once: permissions are followed until the last
	 * one stops, and each stop counts once.
	 */
	listen(): () => void {
		this.#listen_count++;
		const unlisten = this.deps.on_device_change(() => void this.refresh_devices());
		void this.refresh();
		let stopped = false;
		return () => {
			if (stopped) return;
			stopped = true;
			this.#listen_count--;
			unlisten();
			if (this.#listen_count === 0) this.#drop_permission_listeners();
		};
	}

	/**
	 * Picks the device for `kind`, the empty string for the default, and hands
	 * the picks to `on_select`.
	 */
	select(kind: MediaDeviceKind, device_id: string): void {
		if (this.selection[kind] === device_id) return;
		this.selection = { ...this.selection, [kind]: device_id };
		this.#on_select?.(this.selection);
	}

	/** The listed device picked for `kind`, or `null` for the default or a device that's away. */
	selected(kind: MediaDeviceKind): MediaDeviceInfo | null {
		const id = this.selection[kind];
		if (!id) return null;
		return this.devices.find((d) => d.kind === kind && d.deviceId === id) ?? null;
	}

	/**
	 * Whether the list carries real ids and labels for `kind`. A browser that
	 * has the mic's permission but not the camera's labels the audio devices
	 * and leaves the cameras blank, so each kind is vouched for on its own.
	 */
	labeled_for(kind: MediaDeviceKind): boolean {
		return this.devices.some((d) => d.kind === kind && d.deviceId && d.label);
	}

	/**
	 * Whether the pick for `kind` is known to be away: a device was picked,
	 * the list is labeled for `kind`, and the device isn't in it. The pick is
	 * kept, so the device is used again when it returns.
	 */
	missing(kind: MediaDeviceKind): boolean {
		return !!this.selection[kind] && this.labeled_for(kind) && !this.selected(kind);
	}

	/**
	 * The `deviceId` constraint for the pick of `kind`: `exact` when the list
	 * vouches for it, `ideal` while the list can't be checked for `kind`
	 * (before its permission), and `undefined` for the default or a device
	 * that's away, so opening it never fails on a stale pick.
	 */
	to_device_constraint(kind: 'audioinput' | 'videoinput'): ConstrainDOMString | undefined {
		const id = this.selection[kind];
		if (!id) return undefined;
		if (this.selected(kind)) return { exact: id };
		if (!this.labeled_for(kind)) return { ideal: id };
		return undefined;
	}

	/**
	 * Asks the person for an output device (`selectAudioOutput`, Firefox), and
	 * picks it. Call it from a click.
	 */
	async pick_audio_output(): Promise<AudioOutputPick> {
		const select = this.deps.select_audio_output;
		if (!select) {
			return {
				ok: false,
				error: to_media_access_error({ name: 'NotSupportedError' }, 'output')
			};
		}
		let device: MediaDeviceInfo;
		try {
			device = await select();
		} catch (error) {
			return { ok: false, error: to_media_access_error(error, 'output') };
		}
		await this.refresh_devices();
		this.select('audiooutput', device.deviceId);
		return { ok: true, device };
	}

	#follow_permission(
		status: MediaPermissionStatus | null,
		set: (state: PermissionState) => void
	): void {
		if (!status) return;
		const on_change = (): void => {
			set(status.state);
			// a grant reveals labels, a revoke hides them
			void this.refresh_devices();
		};
		status.addEventListener('change', on_change);
		this.#unlisten_permissions.push(() => status.removeEventListener('change', on_change));
	}

	#drop_permission_listeners(): void {
		for (const unlisten of this.#unlisten_permissions) unlisten();
		this.#unlisten_permissions = [];
	}
}
