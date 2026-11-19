/**
 * Sends an `AudioContext`'s sound, or a media element's, to a chosen output
 * device.
 *
 * Browsers differ, so each route is feature-detected, never sniffed:
 *
 * - **`context`** — the context itself takes a sink (`AudioContext.setSinkId`,
 *   Chromium). Lowest delay, nothing extra in the graph.
 * - **`element`** — the context can't, but media elements can
 *   (`HTMLMediaElement.setSinkId`, Firefox): the context plays into a
 *   `MediaStreamAudioDestinationNode` whose stream an `<audio>` element
 *   plays on the chosen device. Adds the element's buffering. The element's
 *   `play()` comes after `await setSinkId`, past a click's transient
 *   activation, so this route relies on the page's sticky activation: the
 *   person has already interacted with it, as the Join click that unlocks
 *   a call's context does. Without that the browser's autoplay policy
 *   refuses the audible element, which reads as `play_refused`.
 * - **`default`** — the system default, straight from the context. Safari
 *   offers no output choice, so it only ever has this one.
 *
 * @module
 */

import { noop } from '@fuzdev/fuz_util/function.ts';

import { MEDIA_PLAY_REFUSED_ERROR_NAME } from './media_errors.ts';

/** How a context's sound reaches its output device. */
export type AudioOutputRoute = 'default' | 'context' | 'element';

/** A context routed to an output device. */
export interface AudioOutput {
	/** The node to connect sound to. */
	node: AudioNode;
	route: AudioOutputRoute;
	/** Stops the route's element, if it has one. The context stays open. */
	close: () => void;
}

/** The browser `create_audio_output` runs in. */
export interface AudioOutputDeps {
	/** `new Audio()`, for the `element` route, or `null` to rule that route out. */
	create_audio_element: (() => HTMLAudioElement) | null;
}

/** `AudioOutputDeps` over the real browser; no element route without `Audio`. */
export const create_audio_output_deps = (): AudioOutputDeps => ({
	create_audio_element: typeof Audio === 'undefined' ? null : () => new Audio()
});

interface SinkCapable {
	setSinkId: (sink_id: string) => Promise<void>;
}

/**
 * Whether `value` takes an output device (`setSinkId`), read off the value,
 * so it works for any context or element.
 */
export const supports_sink_id = (value: object): value is SinkCapable => 'setSinkId' in value;

/**
 * Whether this browser can send sound to a chosen output device by either
 * route. `false` during SSR.
 */
export const can_choose_audio_output = (): boolean =>
	(typeof AudioContext !== 'undefined' && 'setSinkId' in AudioContext.prototype) ||
	(typeof HTMLMediaElement !== 'undefined' && 'setSinkId' in HTMLMediaElement.prototype);

/**
 * Routes `context` to the output device `sink_id`, the empty string being
 * the system default. A context that takes a sink is set back to the
 * default for the empty string too, so switching back works.
 *
 * @param context - the context whose sound should play
 * @param sink_id - an `audiooutput` device id, or the empty string for the default
 * @returns the node to connect sound to, its route, and a close for it
 * @throws DOMException when the browser refuses the device, or
 *   `NotSupportedError` when no route can reach a non-default device
 * @throws Error named `MEDIA_PLAY_REFUSED_ERROR_NAME` when the element
 *   route's `play()` is refused as autoplay, with the browser's error as its
 *   `cause`; call it from a page the person has interacted with
 */
export const create_audio_output = async (
	context: AudioContext,
	sink_id: string,
	deps: AudioOutputDeps = create_audio_output_deps()
): Promise<AudioOutput> => {
	// widened, so a lib that already types `setSinkId` doesn't narrow `context` away below
	const sinkable: object = context;
	if (supports_sink_id(sinkable)) {
		await sinkable.setSinkId(sink_id);
		return { node: context.destination, route: sink_id ? 'context' : 'default', close: noop };
	}
	if (!sink_id) return { node: context.destination, route: 'default', close: noop };
	const audio = deps.create_audio_element?.();
	if (!audio || !supports_sink_id(audio)) {
		throw new DOMException('this browser cannot choose an output device', 'NotSupportedError');
	}
	const destination = context.createMediaStreamDestination();
	const close = (): void => {
		audio.pause();
		audio.srcObject = null;
	};
	try {
		audio.srcObject = destination.stream;
		await audio.setSinkId(sink_id);
	} catch (error) {
		close();
		throw error;
	}
	try {
		await audio.play();
	} catch (error) {
		close();
		// past the `await` above, `NotAllowedError` is the autoplay policy, not a refused device
		if ((error as { name?: unknown } | null)?.name !== 'NotAllowedError') throw error;
		throw Object.assign(
			new Error('the browser refused to start the output device’s playback', {
				cause: error
			}),
			{ name: MEDIA_PLAY_REFUSED_ERROR_NAME }
		);
	}
	return { node: destination, route: 'element', close };
};

/**
 * Sets a media element's output device, where the browser can; elsewhere it
 * keeps the default.
 *
 * @param el - the element to route
 * @param sink_id - an `audiooutput` device id, or the empty string for the default
 * @returns whether the browser took the device
 * @throws DOMException when the browser refuses the device
 */
export const set_media_element_sink = async (
	el: HTMLMediaElement,
	sink_id: string
): Promise<boolean> => {
	const sinkable: object = el;
	if (!supports_sink_id(sinkable)) return false;
	await sinkable.setSinkId(sink_id);
	return true;
};
