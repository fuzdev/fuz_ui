import { describe, test, assert } from 'vitest';

import {
	MEDIA_PLAY_REFUSED_ERROR_NAME,
	media_access_error_message,
	to_media_access_error,
	type MediaAccessErrorReason,
	type MediaAccessKind
} from '#lib/media_errors.ts';

import { dom_error } from './media_test_helpers.ts';

describe('to_media_access_error', () => {
	const cases: Array<[name: string, reason: MediaAccessErrorReason]> = [
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
		['NotSupportedError', 'unsupported'],
		[MEDIA_PLAY_REFUSED_ERROR_NAME, 'play_refused'],
		['SomethingNewError', 'unknown']
	];
	test.each(cases)('%s reads as %s', (name, reason) => {
		const error = to_media_access_error(dom_error(name), 'mic');
		assert.strictEqual(error.reason, reason);
		assert.strictEqual(error.name, name);
		assert.strictEqual(error.kind, 'mic');
	});

	test('reads the name off a plain object, as some browsers throw OverconstrainedError', () => {
		const error = to_media_access_error(
			{ name: 'OverconstrainedError', constraint: 'deviceId' },
			'camera'
		);
		assert.strictEqual(error.reason, 'overconstrained');
	});

	test('a value with no name is unknown, and its words carry the message', () => {
		const error = to_media_access_error(new Error('the driver fell over'), 'camera');
		assert.strictEqual(error.reason, 'unknown');
		assert.include(error.message, 'the driver fell over');
		const bare = to_media_access_error(null, 'camera');
		assert.strictEqual(bare.reason, 'unknown');
		assert.isNull(bare.name);
	});

	test('a name only an object inherits is unknown', () => {
		for (const name of ['toString', 'constructor', '__proto__']) {
			const error = to_media_access_error(dom_error(name), 'mic');
			assert.strictEqual(error.reason, 'unknown', name);
			assert.strictEqual(error.message, media_access_error_message('unknown', 'mic', name));
		}
	});

	test('a refusal gets the default words', () => {
		const error = to_media_access_error(dom_error('NotAllowedError'), 'mic');
		assert.strictEqual(error.message, media_access_error_message('denied', 'mic'));
		assert.include(error.message, 'the mic');
	});
});

describe('media_access_error_message', () => {
	const reasons: Array<MediaAccessErrorReason> = [
		'denied',
		'blocked',
		'not_found',
		'in_use',
		'overconstrained',
		'aborted',
		'play_refused',
		'unsupported',
		'ended',
		'unknown'
	];
	const kinds: Array<MediaAccessKind> = ['mic', 'camera', 'screen', 'output'];

	test('every reason and kind has words that start with a capital', () => {
		for (const reason of reasons) {
			for (const kind of kinds) {
				const message = media_access_error_message(reason, kind);
				assert.ok(message, `${reason} ${kind}`);
				assert.match(message, /^[A-Z]/, `${reason} ${kind}: ${message}`);
			}
		}
	});

	test('a cancelled screen picker reads as cancelled, not as a refused permission', () => {
		assert.include(media_access_error_message('denied', 'screen'), 'cancelled');
	});

	test('a screen the browser can not share is not blamed on an insecure page', () => {
		// phones offer `mediaDevices` on a secure page but no `getDisplayMedia`
		const message = media_access_error_message('unsupported', 'screen');
		assert.include(message, 'share a screen');
		assert.notInclude(message, 'secure');
	});

	test('playback refused as autoplay asks for a click', () => {
		assert.include(media_access_error_message('play_refused', 'output'), 'click');
	});
});
