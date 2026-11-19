import { describe, test, assert, beforeEach } from 'vitest';

import { RemoteAudio, type RemoteAudioDeps } from '#lib/remote_audio.svelte.ts';

import {
	FakeAudioContext,
	FakeAudioElement,
	FakeDestinationNode,
	FakeStream,
	FakeTrack,
	dom_error,
	flush,
	type FakeAudioContextOptions
} from './media_test_helpers.ts';

let contexts: Array<FakeAudioContext>;
let elements: Array<FakeAudioElement>;
let context_options: FakeAudioContextOptions;
let element_sink: boolean;
let deps: RemoteAudioDeps;

beforeEach(() => {
	contexts = [];
	elements = [];
	context_options = {};
	element_sink = false;
	deps = {
		create_audio_context: () => {
			const context = new FakeAudioContext(context_options);
			contexts.push(context);
			return context.as_context();
		},
		create_audio_element: () => {
			const element = new FakeAudioElement(element_sink);
			elements.push(element);
			return element.as_element();
		},
		can_choose_output: () => !!context_options.sink || element_sink
	};
});

const peer_stream = (level = 0.2): FakeStream => {
	const stream = new FakeStream([new FakeTrack('audio')]);
	stream.level = level;
	return stream;
};

/** What reaches the speakers. */
const heard = (context: FakeAudioContext): number => context.destination.input_level();

describe('RemoteAudio unlock', () => {
	test('touches nothing until unlock, which opens and resumes one context', async () => {
		const audio = new RemoteAudio({ deps });
		assert.strictEqual(audio.status, 'locked');
		assert.strictEqual(contexts.length, 0);
		const unlocked = audio.unlock();
		assert.strictEqual(contexts[0]!.resume_calls, 1, 'resumed before any await, inside the click');
		await unlocked;
		assert.strictEqual(audio.status, 'running');
		assert.isFalse(audio.needs_resume);
		await audio.unlock();
		assert.strictEqual(contexts.length, 1, 'one context for the whole call');
	});

	test('needs_resume stays false through unlock until the resume settles', async () => {
		const audio = new RemoteAudio({ deps });
		const unlocked = audio.unlock();
		assert.strictEqual(contexts[0]!.state, 'suspended', 'a fresh context, not yet resumed');
		assert.strictEqual(audio.status, 'locked');
		assert.isFalse(audio.needs_resume, 'no prompt flashes while the browser answers');
		await Promise.resolve();
		assert.isFalse(audio.needs_resume);
		await unlocked;
		assert.strictEqual(audio.status, 'running');
		assert.isFalse(audio.needs_resume);
	});

	test('a stream arriving later, with no gesture, plays through the unlocked context', async () => {
		const audio = new RemoteAudio({ deps });
		await audio.unlock();
		const stream = peer_stream(0.2);
		audio.add('ada', stream.as_stream());
		assert.closeTo(heard(contexts[0]!), 0.2, 1e-9);
	});

	test('streams added before unlock start playing at unlock', async () => {
		const audio = new RemoteAudio({ deps });
		audio.add('ada', peer_stream(0.2).as_stream());
		assert.isTrue(audio.has('ada'));
		await audio.unlock();
		assert.closeTo(heard(contexts[0]!), 0.2, 1e-9);
	});

	test('a refused resume leaves it suspended, asking for a gesture', async () => {
		context_options.resumes_to = 'suspended';
		const audio = new RemoteAudio({ deps });
		await audio.unlock();
		assert.strictEqual(audio.status, 'suspended');
		assert.isTrue(audio.needs_resume);
	});
});

describe('RemoteAudio suspension', () => {
	test('an interruption asks for a tap, and resume from it plays again', async () => {
		const audio = new RemoteAudio({ deps });
		await audio.unlock();
		audio.add('ada', peer_stream(0.2).as_stream());
		const context = contexts[0]!;
		context.set_state('interrupted');
		assert.strictEqual(audio.status, 'interrupted');
		assert.isTrue(audio.needs_resume);
		assert.strictEqual(heard(context), 0);
		await audio.resume();
		assert.strictEqual(audio.status, 'running');
		assert.isFalse(audio.needs_resume);
		assert.closeTo(heard(context), 0.2, 1e-9);
	});

	test('a suspension by the browser asks for a tap too', async () => {
		const audio = new RemoteAudio({ deps });
		await audio.unlock();
		contexts[0]!.set_state('suspended');
		assert.isTrue(audio.needs_resume);
	});

	test('resume does nothing before unlock, so a stray tap starts nothing', async () => {
		const audio = new RemoteAudio({ deps });
		await audio.resume();
		assert.strictEqual(contexts.length, 0);
		assert.strictEqual(audio.status, 'locked');
	});

	test('a context the browser closed is replaced at the next unlock, its streams kept', async () => {
		const audio = new RemoteAudio({ deps });
		await audio.unlock();
		audio.add('ada', peer_stream(0.2).as_stream());
		audio.set_volume('ada', 0.5);
		audio.read_level('ada');
		const old_gain = [...contexts[0]!.destination.inputs][0];
		assert.ok(old_gain);
		contexts[0]!.set_state('closed');
		assert.strictEqual(audio.status, 'closed');
		await audio.unlock();
		assert.strictEqual(contexts.length, 2);
		assert.strictEqual(audio.status, 'running');
		assert.isTrue(audio.has('ada'));
		assert.closeTo(heard(contexts[1]!), 0.1, 1e-9, 'heard in the fresh context, at its volume');
		assert.strictEqual(old_gain.outputs.size, 0, 'the old nodes let go');
		assert.closeTo(audio.read_level('ada'), 0.2, 1e-6, 'the meter reads the fresh source');
		assert.strictEqual(elements.length, 1, 'the helper element is kept');
		assert.isFalse(elements[0]!.paused);
	});

	test('an output picked after the browser closed the context applies at the next unlock', async () => {
		context_options.sink = true;
		const audio = new RemoteAudio({ deps });
		await audio.unlock();
		contexts[0]!.set_state('closed');
		const result = await audio.set_output('headset');
		assert.isTrue(result.ok, 'kept for the next unlock, not refused by the dead context');
		assert.isNull(audio.output_error);
		assert.strictEqual(audio.output_device_id, 'headset');
		await audio.unlock();
		await flush();
		assert.strictEqual(contexts[1]!.sink_id, 'headset');
	});

	test('a context the browser closed carries the output device to the fresh one', async () => {
		context_options.sink = true;
		const audio = new RemoteAudio({ deps });
		await audio.unlock();
		await audio.set_output('headset');
		audio.add('ada', peer_stream().as_stream());
		contexts[0]!.set_state('closed');
		await audio.unlock();
		await flush();
		assert.closeTo(heard(contexts[1]!), 0.2, 1e-9, 'its streams play in the fresh one');
		assert.strictEqual(contexts[1]!.sink_id, 'headset');
		assert.strictEqual(audio.output_device_id, 'headset');
		assert.strictEqual(audio.output_route, 'context');
	});
});

describe('RemoteAudio streams', () => {
	test('each stream gets a muted helper element holding it', async () => {
		const audio = new RemoteAudio({ deps });
		await audio.unlock();
		const stream = peer_stream();
		audio.add('ada', stream.as_stream());
		assert.strictEqual(elements.length, 1);
		const element = elements[0]!;
		assert.isTrue(element.muted, 'heard through the context, never the element');
		assert.strictEqual(element.srcObject, stream.as_stream());
		assert.isFalse(element.paused);
	});

	test('helper_elements: false makes none', async () => {
		const audio = new RemoteAudio({ deps, helper_elements: false });
		await audio.unlock();
		audio.add('ada', peer_stream().as_stream());
		assert.strictEqual(elements.length, 0);
		assert.closeTo(heard(contexts[0]!), 0.2, 1e-9);
	});

	test('per-stream volume and mute change only that stream', async () => {
		const audio = new RemoteAudio({ deps });
		await audio.unlock();
		audio.add('ada', peer_stream(0.2).as_stream());
		audio.add('bea', peer_stream(0.1).as_stream());
		const context = contexts[0]!;
		assert.closeTo(heard(context), 0.3, 1e-9);
		audio.set_volume('ada', 0.5);
		assert.strictEqual(audio.get_volume('ada'), 0.5);
		assert.strictEqual(audio.get_volume('bea'), 1);
		assert.closeTo(heard(context), 0.2, 1e-9);
		audio.set_muted('bea', true);
		assert.isTrue(audio.is_muted('bea'));
		assert.closeTo(heard(context), 0.1, 1e-9);
		audio.set_muted('bea', false);
		assert.closeTo(heard(context), 0.2, 1e-9, 'the unmute keeps the volume');
		audio.set_volume('ada', -1);
		assert.strictEqual(audio.get_volume('ada'), 0);
	});

	test('volume and mute set before a stream arrives, or across a new stream, apply to it', async () => {
		const audio = new RemoteAudio({ deps });
		await audio.unlock();
		audio.set_volume('ada', 0.5);
		audio.add('ada', peer_stream(0.2).as_stream());
		assert.closeTo(heard(contexts[0]!), 0.1, 1e-9);
		audio.add('ada', peer_stream(0.4).as_stream());
		assert.closeTo(heard(contexts[0]!), 0.2, 1e-9, 'replaced, not doubled');
	});

	test('a stream removed disconnects its nodes and lets go of its element', async () => {
		const audio = new RemoteAudio({ deps });
		await audio.unlock();
		const stream = peer_stream(0.2);
		audio.add('ada', stream.as_stream());
		audio.read_level('ada');
		const context = contexts[0]!;
		const [gain] = [...context.destination.inputs];
		assert.ok(gain);
		const [source] = [...gain.inputs];
		assert.ok(source);
		audio.remove('ada');
		assert.strictEqual(context.destination.inputs.size, 0);
		assert.strictEqual(source.outputs.size, 0, 'the source feeds nothing, the meter included');
		assert.strictEqual(gain.outputs.size, 0);
		assert.isNull(elements[0]!.srcObject);
		assert.isTrue(elements[0]!.paused);
		assert.isFalse(audio.has('ada'));
		assert.strictEqual(audio.read_level('ada'), 0);
		stream.add_remote_track(new FakeTrack('audio'));
		assert.strictEqual(context.destination.inputs.size, 0, 'no longer listening for tracks');
	});

	test('a stream with no audio track yet is wired when one arrives', async () => {
		const audio = new RemoteAudio({ deps });
		await audio.unlock();
		const stream = new FakeStream([new FakeTrack('video')]);
		stream.level = 0.3;
		audio.add('ada', stream.as_stream());
		assert.strictEqual(heard(contexts[0]!), 0);
		stream.add_remote_track(new FakeTrack('audio'));
		assert.closeTo(heard(contexts[0]!), 0.3, 1e-9);
		stream.add_remote_track(new FakeTrack('audio'));
		assert.closeTo(heard(contexts[0]!), 0.3, 1e-9, 'wired once');
	});

	test('read_level reads before volume and mute', async () => {
		const audio = new RemoteAudio({ deps });
		await audio.unlock();
		audio.add('ada', peer_stream(0.2).as_stream());
		audio.set_muted('ada', true);
		assert.closeTo(audio.read_level('ada'), 0.2, 1e-6);
		assert.strictEqual(audio.read_level('nobody'), 0);
	});

	test('clear removes every stream and keeps the context', async () => {
		const audio = new RemoteAudio({ deps });
		await audio.unlock();
		audio.add('ada', peer_stream().as_stream());
		audio.add('bea', peer_stream().as_stream());
		audio.clear();
		assert.strictEqual(contexts[0]!.destination.inputs.size, 0);
		assert.strictEqual(audio.status, 'running');
	});

	test('close stops everything, and a later unlock opens a fresh context', async () => {
		const audio = new RemoteAudio({ deps });
		await audio.unlock();
		audio.add('ada', peer_stream().as_stream());
		audio.set_volume('ada', 0.5);
		audio.close();
		assert.strictEqual(audio.status, 'closed');
		assert.isNull(audio.context);
		assert.strictEqual(contexts[0]!.state, 'closed');
		assert.isFalse(audio.has('ada'));
		assert.strictEqual(audio.get_volume('ada'), 0.5, 'volumes are kept');
		await audio.unlock();
		assert.strictEqual(contexts.length, 2);
		assert.strictEqual(audio.status, 'running');
	});
});

describe('RemoteAudio output', () => {
	test('setSinkId absent: the default output, and the state says so', async () => {
		const audio = new RemoteAudio({ deps });
		assert.isFalse(audio.can_choose_output);
		await audio.unlock();
		audio.add('ada', peer_stream(0.2).as_stream());
		const result = await audio.set_output('headset');
		assert.ok(!result.ok);
		assert.strictEqual(result.error.reason, 'unsupported');
		assert.strictEqual(audio.output_error?.reason, 'unsupported');
		assert.strictEqual(audio.output_route, 'default');
		assert.strictEqual(audio.output_device_id, '');
		assert.closeTo(heard(contexts[0]!), 0.2, 1e-9, 'still playing on the default');
	});

	test('a context with setSinkId takes the device directly', async () => {
		context_options.sink = true;
		const audio = new RemoteAudio({ deps });
		assert.isTrue(audio.can_choose_output);
		await audio.unlock();
		audio.add('ada', peer_stream(0.2).as_stream());
		const result = await audio.set_output('headset');
		assert.ok(result.ok);
		assert.strictEqual(contexts[0]!.sink_id, 'headset');
		assert.strictEqual(audio.output_route, 'context');
		assert.strictEqual(audio.output_device_id, 'headset');
		assert.closeTo(heard(contexts[0]!), 0.2, 1e-9);
		await audio.set_output('');
		assert.strictEqual(contexts[0]!.sink_id, '', 'back to the default');
		assert.strictEqual(audio.output_route, 'default');
	});

	test('an output picked before unlock is applied there', async () => {
		context_options.sink = true;
		const audio = new RemoteAudio({ deps });
		const result = await audio.set_output('headset');
		assert.ok(result.ok);
		assert.strictEqual(audio.output_device_id, 'headset');
		await audio.unlock();
		await flush();
		assert.strictEqual(contexts[0]!.sink_id, 'headset');
		assert.strictEqual(audio.output_route, 'context');
	});

	test('an output picked before unlock and refused there falls back to the default', async () => {
		context_options.sink = true;
		const audio = new RemoteAudio({ deps });
		await audio.set_output('gone');
		const create = deps.create_audio_context;
		deps.create_audio_context = () => {
			const context = create();
			(context as unknown as FakeAudioContext).refused_sinks.add('gone');
			return context;
		};
		await audio.unlock();
		await flush();
		assert.strictEqual(audio.output_device_id, '');
		assert.strictEqual(audio.output_error?.reason, 'not_found');
		assert.strictEqual(audio.output_route, 'default');
	});

	test('a refused device keeps the output in effect', async () => {
		context_options.sink = true;
		const audio = new RemoteAudio({ deps });
		await audio.unlock();
		await audio.set_output('headset');
		contexts[0]!.refused_sinks.add('gone');
		const result = await audio.set_output('gone');
		assert.ok(!result.ok);
		assert.strictEqual(result.error.reason, 'not_found');
		assert.strictEqual(audio.output_device_id, 'headset');
		assert.strictEqual(contexts[0]!.sink_id, 'headset');
		assert.strictEqual(audio.output_error?.reason, 'not_found');
		await audio.set_output('');
		assert.isNull(audio.output_error, 'cleared by the next change that works');
	});

	test('where only elements take a sink, the call plays through one on the device', async () => {
		element_sink = true;
		const audio = new RemoteAudio({ deps, helper_elements: false });
		assert.isTrue(audio.can_choose_output);
		await audio.unlock();
		audio.add('ada', peer_stream(0.2).as_stream());
		const context = contexts[0]!;
		await audio.set_output('headset');
		assert.strictEqual(audio.output_route, 'element');
		assert.strictEqual(elements.length, 1);
		const element = elements[0]!;
		assert.strictEqual(element.sink_id, 'headset');
		assert.isFalse(element.paused);
		assert.isFalse(element.muted, 'this element is the one heard');
		const route = context.nodes.find((n) => n instanceof FakeDestinationNode);
		assert.ok(route);
		assert.strictEqual(element.srcObject, route.stream.as_stream());
		assert.closeTo(route.input_level(), 0.2, 1e-9, 'the call feeds the element');
		assert.strictEqual(heard(context), 0, 'nothing on the default output');
		await audio.set_output('');
		assert.isTrue(element.paused, 'the element route closed');
		assert.isNull(element.srcObject);
		assert.strictEqual(route.input_level(), 0);
		assert.closeTo(heard(context), 0.2, 1e-9, 'back on the default');
	});

	test('close stops the element route', async () => {
		element_sink = true;
		const audio = new RemoteAudio({ deps, helper_elements: false });
		await audio.unlock();
		await audio.set_output('headset');
		const element = elements[0]!;
		assert.isFalse(element.paused);
		audio.close();
		assert.isTrue(element.paused, 'nothing left playing on the device');
		assert.isNull(element.srcObject);
		assert.strictEqual(audio.output_route, 'default');
	});

	test("the element route's playback refused as autoplay reads as play_refused", async () => {
		element_sink = true;
		const audio = new RemoteAudio({ deps, helper_elements: false });
		await audio.unlock();
		const create = deps.create_audio_element;
		deps.create_audio_element = () => {
			const element = create();
			element.play = () => Promise.reject(dom_error('NotAllowedError'));
			return element;
		};
		const result = await audio.set_output('headset');
		assert.ok(!result.ok);
		assert.strictEqual(result.error.reason, 'play_refused');
		assert.strictEqual(audio.output_error?.reason, 'play_refused');
		assert.strictEqual(audio.output_route, 'default');
		assert.isNull(elements[0]!.srcObject, 'the route closed');
	});

	test('a later output change wins over an earlier one still pending', async () => {
		context_options.sink = true;
		const audio = new RemoteAudio({ deps });
		await audio.unlock();
		const first = audio.set_output('a');
		const second = audio.set_output('b');
		const [first_result, second_result] = await Promise.all([first, second]);
		assert.ok(!first_result.ok);
		assert.strictEqual(first_result.error.reason, 'aborted');
		assert.ok(second_result.ok);
		assert.strictEqual(audio.output_device_id, 'b');
	});

	test('a failure after a superseded change landed rolls back to the device it landed on', async () => {
		context_options.sink = true;
		const audio = new RemoteAudio({ deps });
		await audio.unlock();
		await audio.set_output('headset');
		const context = contexts[0]!;
		context.hold_sinks = true;
		const first = audio.set_output('a');
		const second = audio.set_output('gone');
		const [to_a, to_gone] = context.sink_requests;
		assert.ok(to_a && to_gone);
		to_a.resolve();
		const first_result = await first;
		assert.ok(!first_result.ok);
		assert.strictEqual(first_result.error.reason, 'aborted', 'superseded, though it landed');
		to_gone.reject(dom_error('NotFoundError'));
		const second_result = await second;
		assert.ok(!second_result.ok);
		assert.strictEqual(second_result.error.reason, 'not_found');
		assert.strictEqual(context.sink_id, 'a', 'sound goes to the superseded pick');
		assert.strictEqual(audio.output_device_id, 'a', 'rolled back to where sound goes');
		assert.strictEqual(audio.output_route, 'context');
		assert.strictEqual(audio.output_error?.reason, 'not_found');
	});

	test('a superseded change back to the default that landed is rolled back to', async () => {
		context_options.sink = true;
		const audio = new RemoteAudio({ deps });
		await audio.unlock();
		await audio.set_output('headset');
		const context = contexts[0]!;
		context.hold_sinks = true;
		const first = audio.set_output('');
		const second = audio.set_output('gone');
		const [to_default, to_gone] = context.sink_requests;
		assert.ok(to_default && to_gone);
		to_default.resolve();
		await first;
		to_gone.reject(dom_error('NotFoundError'));
		await second;
		assert.strictEqual(context.sink_id, '');
		assert.strictEqual(audio.output_device_id, '');
		assert.strictEqual(audio.output_route, 'default', 'the route follows the device');
	});

	test('a context the browser closed while a change was pending keeps the pick for the next unlock', async () => {
		context_options.sink = true;
		const audio = new RemoteAudio({ deps });
		await audio.unlock();
		const context = contexts[0]!;
		// an earlier refusal, so the kept pick is seen to clear it
		context.refused_sinks.add('gone');
		await audio.set_output('gone');
		assert.isNotNull(audio.output_error);
		context.hold_sinks = true;
		const pending = audio.set_output('headset');
		context.set_state('closed');
		context.sink_requests[0]!.reject(dom_error('InvalidStateError'));
		const result = await pending;
		assert.isTrue(result.ok, 'kept, not refused by the dead context');
		assert.isNull(audio.output_error);
		assert.strictEqual(audio.output_device_id, 'headset');
		await audio.unlock();
		await flush();
		assert.strictEqual(contexts.length, 2);
		assert.strictEqual(contexts[1]!.sink_id, 'headset', 'applied to the fresh context');
		assert.strictEqual(audio.output_route, 'context');
	});
});

describe('RemoteAudio output, where sound plays', () => {
	test('a refusal in the fresh context after the browser closed one rolls back to the default', async () => {
		context_options.sink = true;
		const audio = new RemoteAudio({ deps });
		await audio.unlock();
		await audio.set_output('headset');
		contexts[0]!.set_state('closed');
		const create = deps.create_audio_context;
		deps.create_audio_context = () => {
			const context = create();
			(context as unknown as FakeAudioContext).refused_sinks.add('headset');
			return context;
		};
		await audio.unlock();
		await flush();
		assert.strictEqual(audio.output_device_id, '', 'the fresh context plays on the default');
		assert.strictEqual(audio.output_route, 'default');
		assert.strictEqual(audio.output_error?.reason, 'not_found');
	});

	test('a change that lands on a context already replaced is not rolled back to', async () => {
		context_options.sink = true;
		const audio = new RemoteAudio({ deps });
		await audio.unlock();
		const old = contexts[0]!;
		old.hold_sinks = true;
		const pending = audio.set_output('a');
		old.set_state('closed');
		await audio.unlock();
		old.sink_requests[0]!.resolve();
		await pending;
		contexts[1]!.refused_sinks.add('gone');
		await audio.set_output('gone');
		assert.strictEqual(audio.output_device_id, '');
		assert.strictEqual(audio.output_route, 'default');
	});

	test('a superseded element route that landed is closed, not rolled back to', async () => {
		element_sink = true;
		const audio = new RemoteAudio({ deps, helper_elements: false });
		await audio.unlock();
		const held: Array<{ resolve: () => void; reject: (e: unknown) => void }> = [];
		const create = deps.create_audio_element;
		deps.create_audio_element = () => {
			const element = create();
			element.setSinkId = () =>
				new Promise<undefined>((resolve, reject) =>
					held.push({ resolve: () => resolve(undefined), reject })
				);
			return element;
		};
		const first = audio.set_output('a');
		const second = audio.set_output('gone');
		assert.strictEqual(held.length, 2);
		held[0]!.resolve();
		const first_result = await first;
		assert.ok(!first_result.ok);
		assert.strictEqual(first_result.error.reason, 'aborted');
		held[1]!.reject(dom_error('NotFoundError'));
		await second;
		assert.isTrue(elements[0]!.paused, 'the superseded route closed');
		assert.strictEqual(audio.output_device_id, '', 'still on the default');
		assert.strictEqual(audio.output_route, 'default');
	});

	test('a superseded change that failed resolves with its own reason', async () => {
		context_options.sink = true;
		const audio = new RemoteAudio({ deps });
		await audio.unlock();
		const context = contexts[0]!;
		context.hold_sinks = true;
		const first = audio.set_output('gone');
		const second = audio.set_output('b');
		context.sink_requests[0]!.reject(dom_error('NotFoundError'));
		const r = await first;
		context.sink_requests[1]!.resolve();
		await second;
		assert.ok(!r.ok);
		assert.strictEqual(r.error.reason, 'not_found', 'not aborted');
	});
});
