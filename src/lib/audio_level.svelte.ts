/**
 * How loud a stream is, for speaking indicators: a light RMS read off an
 * `AnalyserNode`, and a reactive `AudioLevelState` that polls one.
 *
 * Deliberately small. A speaking dot needs one number a few times a second,
 * not a spectrum or a peak hold, so a probe is one analyser tapped off a
 * node, read only when asked. Probes share the `AudioContext` they're given:
 * a page playing a call routes every remote stream through one context, and
 * its meters belong on the same graph.
 *
 * An analyser in a suspended context reads silence, so a probe is only as
 * live as its context.
 *
 * @module
 */

/** Reads a stream's loudness when asked. */
export interface AudioLevelProbe {
	/** The root-mean-square of the latest samples, 0 (silence) to 1 (full scale). */
	read: () => number;
	/** Disconnects what the probe added to the graph. */
	close: () => void;
}

export interface AudioLevelProbeOptions {
	/**
	 * The analyser's window in samples, a power of two from 32. 1024 is about
	 * 21 ms at 48 kHz.
	 * @default 1024
	 */
	fft_size?: number;
}

/** The default analyser window for `create_audio_level_probe`. */
export const AUDIO_LEVEL_FFT_SIZE = 1024;

/**
 * The root-mean-square of `samples`, 0 for an empty array.
 *
 * @param samples - time-domain samples in -1 to 1
 */
export const to_rms = (samples: Float32Array): number => {
	if (!samples.length) return 0;
	let sum = 0;
	for (const s of samples) sum += s * s;
	return Math.sqrt(sum / samples.length);
};

/**
 * Taps `node` with an analyser in the node's own context. The analyser
 * connects to nothing downstream, so the probe only listens: nothing more
 * reaches the speakers.
 *
 * @param node - any node carrying the sound to measure
 */
export const create_audio_level_probe = (
	node: AudioNode,
	options?: AudioLevelProbeOptions
): AudioLevelProbe => {
	const analyser = node.context.createAnalyser();
	analyser.fftSize = options?.fft_size ?? AUDIO_LEVEL_FFT_SIZE;
	node.connect(analyser);
	const samples = new Float32Array(analyser.fftSize);
	return {
		read: () => {
			analyser.getFloatTimeDomainData(samples);
			return to_rms(samples);
		},
		close: () => {
			// only this probe's edge, so other taps on `node` keep their input;
			// it throws when the edge is already gone (`node` disconnected whole)
			try {
				node.disconnect(analyser);
			} catch {}
		}
	};
};

/**
 * A probe on `stream` in `context`, through a source node of its own.
 * Closing it disconnects the source and leaves the context open, since
 * the caller may share it.
 *
 * @param context - the context to measure in; share the page's when it has one
 * @param stream - a stream with at least one audio track
 * @throws DOMException `InvalidStateError` when `stream` has no audio track
 */
export const create_stream_level_probe = (
	context: AudioContext,
	stream: MediaStream,
	options?: AudioLevelProbeOptions
): AudioLevelProbe => {
	const source = context.createMediaStreamSource(stream);
	const probe = create_audio_level_probe(source, options);
	return {
		read: probe.read,
		close: () => {
			probe.close();
			source.disconnect();
		}
	};
};

/** The browser an `AudioLevelState` runs in: its clock. */
export interface AudioLevelStateDeps {
	/** Calls `fn` every `ms` until the returned stop is called (`setInterval`). */
	repeat: (fn: () => void, ms: number) => () => void;
}

/** `AudioLevelStateDeps` over `setInterval`. */
export const create_audio_level_state_deps = (): AudioLevelStateDeps => ({
	repeat: (fn, ms) => {
		const timer = setInterval(fn, ms);
		return () => clearInterval(timer);
	}
});

/** RMS at or above which `AudioLevelState` counts as speaking, about -40 dBFS. */
export const AUDIO_LEVEL_SPEAKING_RMS = 0.01;

export interface AudioLevelStateOptions {
	/** The current RMS, 0 to 1: a probe's `read`, or any other source. */
	read: () => number;
	/** @default create_audio_level_state_deps() */
	deps?: AudioLevelStateDeps;
	/**
	 * How often to read, in milliseconds.
	 * @default 100
	 */
	interval?: number;
	/**
	 * The RMS at or above which the stream counts as speaking.
	 * @default AUDIO_LEVEL_SPEAKING_RMS
	 */
	speaking_rms?: number;
	/**
	 * How long `speaking` stays on after the level drops, in milliseconds, so
	 * an indicator doesn't flicker between words.
	 * @default 400
	 */
	hold?: number;
}

/**
 * A stream's level and whether it's speaking, polled from `read` between
 * `start` and `stop`. One per indicator, local or remote. It reads nothing
 * until started, so it constructs during SSR:
 * `$effect(() => level_state.start())` polls while the component is mounted.
 */
export class AudioLevelState {
	readonly deps: AudioLevelStateDeps;

	/** The latest RMS, 0 to 1. */
	level: number = $state.raw(0);

	/**
	 * Whether the level reached `speaking_rms` within the last `hold`
	 * milliseconds.
	 */
	speaking: boolean = $state.raw(false);

	#read: () => number;
	#interval: number;
	#speaking_rms: number;
	#hold_reads: number;
	#quiet_reads = Infinity;
	#stop_repeat: (() => void) | null = null;

	constructor(options: AudioLevelStateOptions) {
		this.deps = options.deps ?? create_audio_level_state_deps();
		this.#read = options.read;
		this.#speaking_rms = options.speaking_rms ?? AUDIO_LEVEL_SPEAKING_RMS;
		this.#interval = options.interval ?? 100;
		// counted in reads, so the hold needs no clock of its own
		this.#hold_reads = Math.max(0, Math.round((options.hold ?? 400) / this.#interval));
	}

	/**
	 * Starts polling, if it isn't already.
	 *
	 * @returns `stop`, for an `$effect` to return
	 */
	start(): () => void {
		this.#stop_repeat ??= this.deps.repeat(() => this.#tick(), this.#interval);
		return () => this.stop();
	}

	/** Stops polling and reads as silent. Safe to call twice. */
	stop(): void {
		this.#stop_repeat?.();
		this.#stop_repeat = null;
		this.#quiet_reads = Infinity;
		this.level = 0;
		this.speaking = false;
	}

	#tick(): void {
		const level = this.#read();
		this.level = level;
		if (level >= this.#speaking_rms) {
			this.#quiet_reads = 0;
		} else {
			this.#quiet_reads++;
		}
		this.speaking = this.#quiet_reads <= this.#hold_reads;
	}
}
