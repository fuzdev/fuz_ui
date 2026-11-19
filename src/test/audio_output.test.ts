import { describe, test, assert } from 'vitest';
import { assert_rejects } from '@fuzdev/fuz_util/testing.ts';

import { MEDIA_PLAY_REFUSED_ERROR_NAME, to_media_access_error } from '#lib/media_errors.ts';
import {
	can_choose_audio_output,
	create_audio_output,
	set_media_element_sink,
	supports_sink_id
} from '#lib/audio_output.ts';

import {
	FakeAudioContext,
	FakeAudioElement,
	FakeDestinationNode,
	dom_error
} from './media_test_helpers.ts';

describe('create_audio_output', () => {
	test('the default plays straight from the context', async () => {
		const context = new FakeAudioContext();
		const output = await create_audio_output(context.as_context(), '', {
			create_audio_element: null
		});
		assert.strictEqual(output.route, 'default');
		assert.strictEqual(output.node, context.destination as unknown as AudioNode);
	});

	test('a context that takes a sink is set directly, and set back for the default', async () => {
		const context = new FakeAudioContext({ sink: true });
		const elements: Array<FakeAudioElement> = [];
		const deps = {
			create_audio_element: () => {
				const el = new FakeAudioElement(true);
				elements.push(el);
				return el.as_element();
			}
		};
		const output = await create_audio_output(context.as_context(), 'headset', deps);
		assert.strictEqual(output.route, 'context');
		assert.strictEqual(context.sink_id, 'headset');
		assert.strictEqual(output.node, context.destination as unknown as AudioNode);
		assert.strictEqual(elements.length, 0, 'no element needed');
		const back = await create_audio_output(context.as_context(), '', deps);
		assert.strictEqual(back.route, 'default');
		assert.strictEqual(context.sink_id, '');
	});

	test('without a context sink, an element plays the context on the device', async () => {
		const context = new FakeAudioContext();
		const element = new FakeAudioElement(true);
		const output = await create_audio_output(context.as_context(), 'headset', {
			create_audio_element: () => element.as_element()
		});
		assert.strictEqual(output.route, 'element');
		assert.ok(output.node instanceof FakeDestinationNode);
		assert.strictEqual(
			element.srcObject,
			(output.node as unknown as FakeDestinationNode).stream.as_stream()
		);
		assert.strictEqual(element.sink_id, 'headset');
		assert.isFalse(element.paused);
		output.close();
		assert.isTrue(element.paused);
		assert.isNull(element.srcObject);
	});

	test('no route to a device refuses with NotSupportedError', async () => {
		const context = new FakeAudioContext();
		const err = await assert_rejects(() =>
			create_audio_output(context.as_context(), 'headset', {
				create_audio_element: () => new FakeAudioElement(false).as_element()
			})
		);
		assert.strictEqual(err.name, 'NotSupportedError');
		await assert_rejects(() =>
			create_audio_output(context.as_context(), 'headset', { create_audio_element: null })
		);
	});

	test("the element's playback refused as autoplay closes the route and reads as play_refused", async () => {
		const context = new FakeAudioContext();
		const element = new FakeAudioElement(true);
		const refusal = dom_error('NotAllowedError');
		element.play = () => Promise.reject(refusal);
		const err = await assert_rejects(() =>
			create_audio_output(context.as_context(), 'headset', {
				create_audio_element: () => element.as_element()
			})
		);
		assert.strictEqual(err.name, MEDIA_PLAY_REFUSED_ERROR_NAME);
		assert.strictEqual(err.cause, refusal);
		assert.strictEqual(to_media_access_error(err, 'output').reason, 'play_refused');
		assert.isNull(element.srcObject, 'the route closed');
		assert.isTrue(element.paused);
	});

	test("the element's playback failing otherwise keeps the browser's error", async () => {
		const context = new FakeAudioContext();
		const element = new FakeAudioElement(true);
		element.play = () => Promise.reject(dom_error('AbortError'));
		const err = await assert_rejects(() =>
			create_audio_output(context.as_context(), 'headset', {
				create_audio_element: () => element.as_element()
			})
		);
		assert.strictEqual(err.name, 'AbortError');
		assert.isNull(element.srcObject);
	});

	test("the element's device refused as not allowed stays a refusal, not play_refused", async () => {
		const context = new FakeAudioContext();
		const element = new FakeAudioElement(true);
		element.setSinkId = () => Promise.reject(dom_error('NotAllowedError'));
		const err = await assert_rejects(() =>
			create_audio_output(context.as_context(), 'headset', {
				create_audio_element: () => element.as_element()
			})
		);
		assert.strictEqual(to_media_access_error(err, 'output').reason, 'denied');
		assert.isNull(element.srcObject);
	});

	test('a refused device leaves no element playing', async () => {
		const context = new FakeAudioContext();
		const element = new FakeAudioElement(true);
		element.setSinkId = () =>
			Promise.reject(Object.assign(new Error('gone'), { name: 'NotFoundError' }));
		const err = await assert_rejects(() =>
			create_audio_output(context.as_context(), 'gone', {
				create_audio_element: () => element.as_element()
			})
		);
		assert.strictEqual(err.name, 'NotFoundError');
		assert.isNull(element.srcObject);
	});
});

describe('set_media_element_sink', () => {
	test('sets the sink where the element takes one', async () => {
		const element = new FakeAudioElement(true);
		assert.isTrue(await set_media_element_sink(element.as_element(), 'headset'));
		assert.strictEqual(element.sink_id, 'headset');
	});

	test('reports false where it does not', async () => {
		const element = new FakeAudioElement(false);
		assert.isFalse(await set_media_element_sink(element.as_element(), 'headset'));
	});
});

describe('feature detection', () => {
	test('supports_sink_id reads the value', () => {
		assert.isTrue(supports_sink_id(new FakeAudioElement(true)));
		assert.isFalse(supports_sink_id(new FakeAudioElement(false)));
	});

	test('can_choose_audio_output is false without Web Audio or media elements', () => {
		assert.isFalse(can_choose_audio_output());
	});
});
