import { describe, test, assert } from 'vitest';

import {
	AudioLevelState,
	create_audio_level_probe,
	create_stream_level_probe,
	to_rms
} from '#lib/audio_level.svelte.ts';

import {
	FakeAudioContext,
	FakeStream,
	FakeTrack,
	create_fake_clock,
	type FakeAudioNode
} from './media_test_helpers.ts';

const running_context = (): FakeAudioContext => {
	const context = new FakeAudioContext();
	context.state = 'running';
	return context;
};

describe('to_rms', () => {
	test('of silence, a constant, and a square wave', () => {
		assert.strictEqual(to_rms(new Float32Array(0)), 0);
		assert.strictEqual(to_rms(new Float32Array(8)), 0);
		assert.closeTo(to_rms(new Float32Array(8).fill(0.5)), 0.5, 1e-9);
		assert.closeTo(to_rms(Float32Array.from([1, -1, 1, -1])), 1, 1e-9);
	});
});

describe('create_stream_level_probe', () => {
	test('reads the stream through the given context', () => {
		const context = running_context();
		const stream = new FakeStream([new FakeTrack('audio')]);
		stream.level = 0.25;
		const probe = create_stream_level_probe(context.as_context(), stream.as_stream());
		assert.closeTo(probe.read(), 0.25, 1e-6);
		stream.level = 0;
		assert.strictEqual(probe.read(), 0);
	});

	test('reads silence while the context is suspended', () => {
		const context = new FakeAudioContext();
		const stream = new FakeStream([new FakeTrack('audio')]);
		stream.level = 0.25;
		const probe = create_stream_level_probe(context.as_context(), stream.as_stream());
		assert.strictEqual(probe.read(), 0);
		context.state = 'running';
		assert.closeTo(probe.read(), 0.25, 1e-6);
	});

	test('close disconnects its source and leaves the context open', () => {
		const context = running_context();
		const stream = new FakeStream([new FakeTrack('audio')]);
		const probe = create_stream_level_probe(context.as_context(), stream.as_stream());
		probe.close();
		assert.strictEqual(context.state, 'running');
		assert.strictEqual(probe.read(), 0);
	});
});

describe('create_audio_level_probe', () => {
	test('taps a node without sending anything downstream, and closes only its own edge', () => {
		const context = running_context();
		const stream = new FakeStream([new FakeTrack('audio')]);
		stream.level = 0.1;
		const source = context.createMediaStreamSource(stream.as_stream());
		const gain = context.createGain();
		source.connect(gain);
		const node = source as unknown as AudioNode;
		const probe = create_audio_level_probe(node, { fft_size: 256 });
		const analyser = [...source.outputs].find((n) => n !== gain) as FakeAudioNode & {
			fftSize: number;
		};
		assert.strictEqual(analyser.fftSize, 256);
		assert.strictEqual(analyser.outputs.size, 0, 'the probe only listens');
		assert.closeTo(probe.read(), 0.1, 1e-6);
		probe.close();
		assert.deepEqual([...source.outputs], [gain], 'the other tap keeps its input');
		probe.close(); // the edge is gone; closing again is harmless
	});
});

describe('AudioLevelState', () => {
	test('follows the level and holds speaking between words', () => {
		const clock = create_fake_clock();
		let level = 0;
		const state = new AudioLevelState({
			read: () => level,
			deps: clock,
			interval: 100,
			hold: 200
		});
		clock.tick();
		assert.strictEqual(clock.active, 0, 'nothing polls before start');
		state.start();
		assert.isFalse(state.speaking);
		level = 0.05;
		clock.tick();
		assert.strictEqual(state.level, 0.05);
		assert.isTrue(state.speaking);
		level = 0.001;
		clock.tick(2);
		assert.isTrue(state.speaking, 'held for 200 ms');
		clock.tick();
		assert.isFalse(state.speaking);
		assert.strictEqual(state.level, 0.001);
	});

	test('the threshold is configurable', () => {
		const clock = create_fake_clock();
		const state = new AudioLevelState({ read: () => 0.005, deps: clock, speaking_rms: 0.004 });
		state.start();
		clock.tick();
		assert.isTrue(state.speaking);
	});

	test('stop ends polling and reads silent; start again resumes', () => {
		const clock = create_fake_clock();
		const state = new AudioLevelState({ read: () => 0.5, deps: clock });
		const stop = state.start();
		state.start();
		assert.strictEqual(clock.active, 1, 'one poll however often started');
		clock.tick();
		assert.isTrue(state.speaking);
		stop();
		assert.strictEqual(clock.active, 0);
		assert.isFalse(state.speaking);
		assert.strictEqual(state.level, 0);
		state.stop();
		state.start();
		clock.tick();
		assert.isTrue(state.speaking);
	});
});
