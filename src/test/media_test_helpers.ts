/**
 * Fakes for the browser media modules: `MediaDevices`, streams and tracks,
 * a Web Audio graph, and a manual clock. Each extends `EventTarget` where
 * the real one does, so the modules attach listeners exactly as they would
 * in a browser.
 *
 * The graph carries a level instead of samples: a source emits its stream's
 * `level`, a gain scales what reaches it, and an analyser fills its buffer
 * with the sum of its inputs, so a test can ask what a node hears. A
 * context that isn't `running` carries silence, as a real one does.
 *
 * @module
 */

/** A track: `stop` releases it, `end` is the browser ending it. */
export class FakeTrack extends EventTarget {
	readonly kind: 'audio' | 'video';
	readyState: MediaStreamTrackState = 'live';
	muted = false;
	stopped = false;
	device_id: string;
	constructor(kind: 'audio' | 'video', device_id = `${kind}-device`) {
		super();
		this.kind = kind;
		this.device_id = device_id;
	}
	getSettings(): MediaTrackSettings {
		return { deviceId: this.device_id };
	}
	stop(): void {
		// a real `stop` ends the track without an `ended` event
		this.stopped = true;
		this.readyState = 'ended';
	}
	/** The browser ends the track: unplugged, revoked, or "stop sharing". */
	end(): void {
		this.readyState = 'ended';
		this.dispatchEvent(new Event('ended'));
	}
	set_muted(muted: boolean): void {
		this.muted = muted;
		this.dispatchEvent(new Event(muted ? 'mute' : 'unmute'));
	}
}

/** A stream of fake tracks, carrying `level` as its sound. */
export class FakeStream extends EventTarget {
	tracks: Array<FakeTrack>;
	/** The RMS its audio carries. */
	level = 0;
	constructor(tracks: Array<FakeTrack> = []) {
		super();
		this.tracks = tracks;
	}
	getTracks(): Array<FakeTrack> {
		return [...this.tracks];
	}
	getAudioTracks(): Array<FakeTrack> {
		return this.tracks.filter((t) => t.kind === 'audio');
	}
	getVideoTracks(): Array<FakeTrack> {
		return this.tracks.filter((t) => t.kind === 'video');
	}
	/** A track arrives from the remote side. */
	add_remote_track(track: FakeTrack): void {
		this.tracks.push(track);
		this.dispatchEvent(new Event('addtrack'));
	}
	as_stream(): MediaStream {
		return this as unknown as MediaStream;
	}
}

export const fake_device = (
	kind: MediaDeviceKind,
	device_id: string,
	label = `${kind} ${device_id}`
): MediaDeviceInfo => ({
	kind,
	deviceId: device_id,
	groupId: '',
	label,
	toJSON: () => ({})
});

/** A pending request a test settles by hand. */
export interface FakeMediaRequest {
	constraints: unknown;
	resolve: (stream: FakeStream) => void;
	reject: (error: unknown) => void;
}

/** `navigator.mediaDevices`, whose requests wait for the test to settle them. */
export class FakeMediaDevices extends EventTarget {
	devices: Array<MediaDeviceInfo> = [];
	requests: Array<FakeMediaRequest> = [];
	display_requests: Array<FakeMediaRequest> = [];
	enumerateDevices(): Promise<Array<MediaDeviceInfo>> {
		return Promise.resolve([...this.devices]);
	}
	getUserMedia(constraints: MediaStreamConstraints): Promise<MediaStream> {
		return new Promise((resolve, reject) => {
			this.requests.push({ constraints, resolve: (s) => resolve(s.as_stream()), reject });
		});
	}
	getDisplayMedia(options: DisplayMediaStreamOptions): Promise<MediaStream> {
		return new Promise((resolve, reject) => {
			this.display_requests.push({
				constraints: options,
				resolve: (s) => resolve(s.as_stream()),
				reject
			});
		});
	}
	/** Replaces the device list and fires `devicechange`. */
	set_devices(devices: Array<MediaDeviceInfo>): void {
		this.devices = devices;
		this.dispatchEvent(new Event('devicechange'));
	}
	as_media_devices(): MediaDevices {
		return this as unknown as MediaDevices;
	}
}

export class FakePermissionStatus extends EventTarget {
	state: PermissionState;
	constructor(state: PermissionState) {
		super();
		this.state = state;
	}
	set(state: PermissionState): void {
		this.state = state;
		this.dispatchEvent(new Event('change'));
	}
}

/** `navigator.permissions`, with a status per name; an unknown name throws, as Firefox once did. */
export class FakePermissions {
	statuses: Map<string, FakePermissionStatus> = new Map();
	query(descriptor: PermissionDescriptor): Promise<FakePermissionStatus> {
		const status = this.statuses.get(descriptor.name);
		if (!status) return Promise.reject(new TypeError(`unknown permission ${descriptor.name}`));
		return Promise.resolve(status);
	}
	as_permissions(): Permissions {
		return this as unknown as Permissions;
	}
}

/** A DOMException-shaped error, as browsers throw. */
export const dom_error = (name: string, message = name): Error =>
	Object.assign(new Error(message), { name });

/**
 * A clock whose repeats run only when the test calls `tick`, and whose
 * timeouts fire only when `advance` passes their time.
 */
export interface FakeClock {
	repeat: (fn: () => void, ms: number) => () => void;
	timeout: (fn: () => void, ms: number) => () => void;
	tick: (count?: number) => void;
	/** Moves the clock on by `ms`, firing the timeouts that come due. */
	advance: (ms: number) => void;
	/** The repeats running. */
	readonly active: number;
	/** The timeouts waiting. */
	readonly pending: number;
}

export const create_fake_clock = (): FakeClock => {
	const fns: Set<() => void> = new Set();
	const timeouts: Map<() => void, number> = new Map();
	let now = 0;
	return {
		repeat: (fn) => {
			const run = (): void => fn();
			fns.add(run);
			return () => fns.delete(run);
		},
		timeout: (fn, ms) => {
			const run = (): void => fn();
			timeouts.set(run, now + ms);
			return () => timeouts.delete(run);
		},
		tick: (count = 1) => {
			for (let i = 0; i < count; i++) for (const fn of [...fns]) fn();
		},
		advance: (ms) => {
			now += ms;
			for (const [run, at] of [...timeouts]) {
				if (at > now || !timeouts.has(run)) continue;
				timeouts.delete(run);
				run();
			}
		},
		get active() {
			return fns.size;
		},
		get pending() {
			return timeouts.size;
		}
	};
};

/** A node in the fake graph: edges both ways, and the level it outputs. */
export class FakeAudioNode {
	readonly context: FakeAudioContext;
	readonly inputs: Set<FakeAudioNode> = new Set();
	readonly outputs: Set<FakeAudioNode> = new Set();
	constructor(context: FakeAudioContext) {
		this.context = context;
	}
	connect<T extends FakeAudioNode>(target: T): T {
		// a real node refuses a node of another context
		if (target.context !== this.context) throw dom_error('InvalidAccessError');
		this.outputs.add(target);
		target.inputs.add(this);
		return target;
	}
	disconnect(target?: FakeAudioNode): void {
		if (target) {
			if (!this.outputs.has(target)) throw dom_error('InvalidAccessError');
			this.outputs.delete(target);
			target.inputs.delete(this);
			return;
		}
		for (const output of this.outputs) output.inputs.delete(this);
		this.outputs.clear();
	}
	/** The level this node passes on. */
	output_level(): number {
		return this.input_level();
	}
	/** The sum of what reaches this node, silent unless the context runs. */
	input_level(): number {
		if (this.context.state !== 'running') return 0;
		let sum = 0;
		for (const input of this.inputs) sum += input.output_level();
		return sum;
	}
}

export class FakeSourceNode extends FakeAudioNode {
	readonly stream: FakeStream;
	constructor(context: FakeAudioContext, stream: FakeStream) {
		super(context);
		this.stream = stream;
	}
	override output_level(): number {
		return this.context.state === 'running' ? this.stream.level : 0;
	}
}

export class FakeGainNode extends FakeAudioNode {
	readonly gain = { value: 1 };
	override output_level(): number {
		return this.input_level() * this.gain.value;
	}
}

export class FakeAnalyserNode extends FakeAudioNode {
	fftSize = 2048;
	getFloatTimeDomainData(samples: Float32Array): void {
		// a constant signal, whose RMS is its value
		samples.fill(this.input_level());
	}
}

export class FakeDestinationNode extends FakeAudioNode {
	readonly stream = new FakeStream([new FakeTrack('audio')]);
}

export interface FakeAudioContextOptions {
	/**
	 * The state to start in.
	 * @default 'suspended'
	 */
	state?: AudioContextState;
	/** Adds `setSinkId`, as Chromium has. */
	sink?: boolean;
	/** What `resume` leaves the state as. */
	resumes_to?: AudioContextState;
}

/** A held `setSinkId` a test settles by hand; `resolve` lands the sink. */
export interface FakeSinkRequest {
	sink_id: string;
	resolve: () => void;
	reject: (error: unknown) => void;
}

/**
 * An `AudioContext` that starts `suspended` unless told otherwise, as a
 * context created without a gesture does, and records its sink.
 */
export class FakeAudioContext extends EventTarget {
	state: AudioContextState;
	readonly destination: FakeAudioNode;
	resumes_to: AudioContextState;
	resume_calls = 0;
	sink_id = '';
	/** Device ids `setSinkId` refuses with `NotFoundError`. */
	refused_sinks: Set<string> = new Set();
	/** While true, each `setSinkId` waits in `sink_requests` for the test to settle it. */
	hold_sinks = false;
	sink_requests: Array<FakeSinkRequest> = [];
	declare setSinkId?: (sink_id: string) => Promise<void>;
	constructor(options?: FakeAudioContextOptions) {
		super();
		this.state = options?.state ?? 'suspended';
		this.destination = new FakeAudioNode(this);
		this.resumes_to = options?.resumes_to ?? 'running';
		if (options?.sink) {
			this.setSinkId = (sink_id) => {
				if (this.hold_sinks) {
					return new Promise((resolve, reject) => {
						const land = (): void => {
							this.sink_id = sink_id;
							resolve();
						};
						this.sink_requests.push({ sink_id, resolve: land, reject });
					});
				}
				// a closed context refuses here; the spec's `setSinkId` has no closed-state step, so this models a browser that rejects
				if (this.state === 'closed') return Promise.reject(dom_error('InvalidStateError'));
				if (this.refused_sinks.has(sink_id)) return Promise.reject(dom_error('NotFoundError'));
				this.sink_id = sink_id;
				return Promise.resolve();
			};
		}
	}
	/** Counts the call at once, and answers a tick later, as a browser does. */
	async resume(): Promise<void> {
		this.resume_calls++;
		await Promise.resolve();
		this.set_state(this.resumes_to);
	}
	close(): Promise<void> {
		this.set_state('closed');
		return Promise.resolve();
	}
	/** The browser changes the state: an interruption, a suspension. */
	set_state(state: AudioContextState): void {
		if (this.state === state) return;
		this.state = state;
		this.dispatchEvent(new Event('statechange'));
	}
	/** Every node created in this context, in order. */
	readonly nodes: Array<FakeAudioNode> = [];
	createMediaStreamSource(stream: MediaStream): FakeSourceNode {
		const fake = stream as unknown as FakeStream;
		if (!fake.getAudioTracks().length) throw dom_error('InvalidStateError');
		return this.#track(new FakeSourceNode(this, fake));
	}
	createGain(): FakeGainNode {
		return this.#track(new FakeGainNode(this));
	}
	createAnalyser(): FakeAnalyserNode {
		return this.#track(new FakeAnalyserNode(this));
	}
	createMediaStreamDestination(): FakeDestinationNode {
		return this.#track(new FakeDestinationNode(this));
	}
	#track<T extends FakeAudioNode>(node: T): T {
		this.nodes.push(node);
		return node;
	}
	as_context(): AudioContext {
		return this as unknown as AudioContext;
	}
}

/** An `<audio>` element; `sink` adds `setSinkId`, as Chromium and Firefox have. */
export class FakeAudioElement {
	muted = false;
	srcObject: MediaStream | null = null;
	paused = true;
	sink_id = '';
	declare setSinkId?: (sink_id: string) => Promise<void>;
	constructor(sink = false) {
		if (sink) {
			this.setSinkId = (sink_id) => {
				this.sink_id = sink_id;
				return Promise.resolve();
			};
		}
	}
	play(): Promise<void> {
		this.paused = false;
		return Promise.resolve();
	}
	pause(): void {
		this.paused = true;
	}
	as_element(): HTMLAudioElement {
		return this as unknown as HTMLAudioElement;
	}
}

/** Lets pending promise callbacks run. */
export const flush = async (): Promise<void> => {
	for (let i = 0; i < 5; i++) await Promise.resolve();
};
