/**
 * Why a browser media request failed, as a reason code plus default words.
 *
 * `getUserMedia`, `getDisplayMedia`, and `setSinkId` reject with a
 * `DOMException` whose `name` is the only stable part: messages differ by
 * browser and locale. `to_media_access_error` reads the name (never
 * `instanceof`, since some browsers throw `OverconstrainedError` as a plain
 * object) and the legacy Chromium names, so a UI branches on `reason` and
 * may replace the words with its own. One name is this library's own:
 * `MEDIA_PLAY_REFUSED_ERROR_NAME`, which `create_audio_output` throws when
 * the browser won't start an element's playback.
 *
 * @module
 */

import { to_error_message } from '@fuzdev/fuz_util/error.ts';

/** What a media request was for: an input, or the output device. */
export type MediaAccessKind = 'mic' | 'camera' | 'screen' | 'output';

/**
 * Why a media request failed:
 *
 * - `denied` — the person or the browser refused the permission, or cancelled
 *   the screen picker (browsers don't tell the two apart)
 * - `blocked` — the page may not ask at all (a permissions policy, an
 *   insecure frame)
 * - `not_found` — no device matches
 * - `in_use` — the device is there but couldn't be opened, usually because
 *   another app holds it
 * - `overconstrained` — no device satisfies the constraints
 * - `aborted` — the browser gave up for another reason
 * - `play_refused` — the browser wouldn't start playback without a fresh
 *   gesture (its autoplay policy), so trying again from a click can work
 * - `unsupported` — the browser doesn't offer the API here (an insecure
 *   page, or an older browser)
 * - `ended` — a live track ended on its own: unplugged, or the permission
 *   was taken back
 * - `unknown` — anything else
 */
export type MediaAccessErrorReason =
	| 'denied'
	| 'blocked'
	| 'not_found'
	| 'in_use'
	| 'overconstrained'
	| 'aborted'
	| 'play_refused'
	| 'unsupported'
	| 'ended'
	| 'unknown';

/** A failed media request: the reason to branch on and default words to show. */
export interface MediaAccessError {
	reason: MediaAccessErrorReason;
	kind: MediaAccessKind;
	/** The thrown error's `name`, for diagnostics, or `null` when it had none. */
	name: string | null;
	/** Default words for a person, from `media_access_error_message`. */
	message: string;
}

/**
 * The `name` of the error `create_audio_output` throws when an element's
 * `play()` is refused by the browser's autoplay policy, which also says
 * `NotAllowedError` and would otherwise read as a refused permission.
 */
export const MEDIA_PLAY_REFUSED_ERROR_NAME = 'MediaPlayRefusedError';

// a `Map`, so a name an object inherits (`toString`) isn't read as a reason
const REASONS_BY_NAME: ReadonlyMap<string, MediaAccessErrorReason> = new Map([
	['NotAllowedError', 'denied'],
	['PermissionDeniedError', 'denied'],
	['SecurityError', 'blocked'],
	['NotFoundError', 'not_found'],
	['DevicesNotFoundError', 'not_found'],
	['NotReadableError', 'in_use'],
	['TrackStartError', 'in_use'],
	['OverconstrainedError', 'overconstrained'],
	['ConstraintNotSatisfiedError', 'overconstrained'],
	['AbortError', 'aborted'],
	[MEDIA_PLAY_REFUSED_ERROR_NAME, 'play_refused'],
	['NotSupportedError', 'unsupported']
]);

/**
 * Reads a thrown value from a media request as a `MediaAccessError`.
 *
 * @param error - what `getUserMedia`, `getDisplayMedia`, or `setSinkId` threw
 * @param kind - what the request was for, which picks the words
 */
export const to_media_access_error = (error: unknown, kind: MediaAccessKind): MediaAccessError => {
	const raw_name = (error as { name?: unknown } | null)?.name;
	const name = typeof raw_name === 'string' ? raw_name : null;
	const reason = REASONS_BY_NAME.get(name ?? '') ?? 'unknown';
	const detail = reason === 'unknown' ? to_error_message(error) : undefined;
	return { reason, kind, name, message: media_access_error_message(reason, kind, detail) };
};

const NOUNS: Record<MediaAccessKind, string> = {
	mic: 'the mic',
	camera: 'the camera',
	screen: 'screen sharing',
	output: 'the output device'
};

/**
 * Default words for a failed media request, plain enough to show as is.
 *
 * @param reason - why it failed
 * @param kind - what it was for
 * @param detail - the browser's own message, shown only for `unknown`
 */
export const media_access_error_message = (
	reason: MediaAccessErrorReason,
	kind: MediaAccessKind,
	detail?: string
): string => {
	const noun = NOUNS[kind];
	const Noun = noun[0]!.toUpperCase() + noun.slice(1);
	switch (reason) {
		case 'denied':
			if (kind === 'screen') return 'Screen sharing was cancelled or isn’t allowed.';
			if (kind === 'output') return 'Choosing an output device wasn’t allowed.';
			return `Permission for ${noun} was refused. Allow it for this site in the browser, then try again.`;
		case 'blocked':
			return `${Noun} is blocked on this page by the browser or the site’s settings.`;
		case 'not_found':
			if (kind === 'screen') return 'Nothing was found to share.';
			if (kind === 'output') return 'That output device wasn’t found; it may have been unplugged.';
			return `No ${kind} was found.`;
		case 'in_use':
			return `${Noun} is there but couldn’t be opened; another app may be holding it.`;
		case 'overconstrained':
			return `${Noun} couldn’t be opened with these settings; try another device.`;
		case 'aborted':
			return `${Noun} couldn’t start; try again.`;
		case 'play_refused':
			return `${Noun} couldn’t start playing; try again from a click.`;
		case 'unsupported':
			if (kind === 'output') return 'This browser can’t choose an output device.';
			// phones offer `mediaDevices` on a secure page but no `getDisplayMedia`
			if (kind === 'screen') return 'This browser can’t share a screen.';
			return `This browser doesn’t offer ${noun} here. It needs a secure page: https:// or localhost.`;
		case 'ended':
			if (kind === 'screen') return 'Screen sharing stopped.';
			return `${Noun} stopped: it was unplugged, or the browser took it back.`;
		case 'unknown': {
			const failed = kind === 'output' ? `${Noun} couldn’t be set` : `${Noun} couldn’t start`;
			return detail ? `${failed}: ${detail}` : `${failed}.`;
		}
	}
};
