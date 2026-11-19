import { describe, test, assert, beforeEach } from 'vitest';

import { create_stream_level_probe } from '#lib/audio_level.svelte.ts';
import {
	LOCAL_MEDIA_SILENT_AFTER,
	LocalMedia,
	create_local_media_deps,
	type LocalMediaDeps,
	type LocalMediaKind,
	type LocalMediaOptions
} from '#lib/local_media.svelte.ts';

import {
	FakeAudioContext,
	FakeMediaDevices,
	FakeStream,
	FakeTrack,
	create_fake_clock,
	dom_error,
	flush
} from './media_test_helpers.ts';

let media_devices: FakeMediaDevices;
let clock: ReturnType<typeof create_fake_clock>;
let context: FakeAudioContext;
let deps: LocalMediaDeps;
let probes_opened: number;
let probes_closed: number;

beforeEach(() => {
	media_devices = new FakeMediaDevices();
	clock = create_fake_clock();
	context = new FakeAudioContext();
	context.state = 'running';
	probes_opened = 0;
	probes_closed = 0;
	const platform = create_local_media_deps(media_devices.as_media_devices());
	deps = {
		get_user_media: platform.get_user_media,
		get_display_media: platform.get_display_media,
		create_level_probe: (stream) => {
			const probe = create_stream_level_probe(context.as_context(), stream);
			probes_opened++;
			return {
				read: probe.read,
				close: () => {
					probes_closed++;
					probe.close();
				}
			};
		},
		repeat: clock.repeat,
		timeout: clock.timeout
	};
});

const create_media = (kind: LocalMediaKind, options?: Partial<LocalMediaOptions>): LocalMedia =>
	new LocalMedia({ kind, deps, ...options });

/** Starts `media` and grants its request with a fresh stream. */
const start_with = async (media: LocalMedia, stream: FakeStream): Promise<void> => {
	const started = media.start();
	const requests =
		media.kind === 'screen' ? media_devices.display_requests : media_devices.requests;
	requests.at(-1)!.resolve(stream);
	await started;
};

const mic_stream = (): FakeStream => new FakeStream([new FakeTrack('audio', 'mic-a')]);

describe('LocalMedia mic', () => {
	test('off → starting → live only after a non-silent sample', async () => {
		const mic = create_media('mic');
		assert.strictEqual(mic.status, 'off');
		const started = mic.start();
		assert.strictEqual(mic.status, 'starting');
		assert.isTrue(mic.active);
		const stream = mic_stream();
		media_devices.requests[0]!.resolve(stream);
		await started;
		assert.strictEqual(mic.status, 'starting', 'acquired but not yet heard');
		assert.strictEqual(mic.track, stream.tracks[0] as unknown as MediaStreamTrack, 'sendable now');
		assert.strictEqual(mic.device_id, 'mic-a');
		clock.tick(10);
		assert.strictEqual(mic.status, 'starting', 'digital silence is not heard');
		stream.level = 0.000001;
		clock.tick();
		assert.strictEqual(mic.status, 'starting', 'below the heard threshold');
		stream.level = 0.002;
		clock.tick();
		assert.strictEqual(mic.status, 'live');
		assert.strictEqual(clock.active, 0, 'the probe stops once heard');
		assert.strictEqual(probes_opened, 1);
		assert.strictEqual(probes_closed, 1, 'and is closed');
	});

	test('a stop while starting closes the probe', async () => {
		const mic = create_media('mic');
		await start_with(mic, mic_stream());
		assert.strictEqual(mic.status, 'starting');
		assert.strictEqual(probes_closed, 0);
		mic.stop();
		assert.strictEqual(probes_closed, 1);
		assert.strictEqual(clock.active, 0);
	});

	test('a mic in a suspended context stays starting until the context runs', async () => {
		context.state = 'suspended';
		const mic = create_media('mic');
		const stream = mic_stream();
		stream.level = 0.1;
		await start_with(mic, stream);
		clock.tick(3);
		assert.strictEqual(mic.status, 'starting');
		context.state = 'running';
		clock.tick();
		assert.strictEqual(mic.status, 'live');
	});

	test('a mic heard by nothing for a while reads silent, still starting and still listening', async () => {
		const mic = create_media('mic');
		const stream = mic_stream();
		await start_with(mic, stream);
		clock.tick(10);
		clock.advance(LOCAL_MEDIA_SILENT_AFTER - 1);
		assert.isFalse(mic.silent, 'not yet');
		clock.advance(1);
		assert.isTrue(mic.silent);
		assert.strictEqual(mic.status, 'starting');
		assert.strictEqual(clock.active, 1, 'the probe keeps listening');
		stream.level = 0.002;
		clock.tick();
		assert.strictEqual(mic.status, 'live');
		assert.isFalse(mic.silent, 'the first sample clears it');
	});

	test('a mic heard in time never reads silent', async () => {
		const mic = create_media('mic');
		const stream = mic_stream();
		await start_with(mic, stream);
		stream.level = 0.002;
		clock.tick();
		assert.strictEqual(mic.status, 'live');
		assert.strictEqual(clock.pending, 0, 'the timeout is cancelled');
		clock.advance(LOCAL_MEDIA_SILENT_AFTER);
		assert.isFalse(mic.silent);
	});

	test('silent_after sets the wait, and a stop clears silent', async () => {
		const mic = create_media('mic', { silent_after: 500 });
		await start_with(mic, mic_stream());
		clock.advance(500);
		assert.isTrue(mic.silent);
		mic.stop();
		assert.isFalse(mic.silent);
		await start_with(mic, mic_stream());
		assert.isFalse(mic.silent, 'a fresh start waits again');
		mic.stop();
		assert.strictEqual(clock.pending, 0, 'a stop cancels the timeout');
	});

	test('without a level probe the mic is live on arrival', async () => {
		deps.create_level_probe = null;
		const mic = create_media('mic');
		await start_with(mic, mic_stream());
		assert.strictEqual(mic.status, 'live');
	});

	test('stop releases the device: every track stopped', async () => {
		const mic = create_media('mic');
		const stream = mic_stream();
		await start_with(mic, stream);
		mic.stop();
		assert.strictEqual(mic.status, 'off');
		assert.isNull(mic.stream);
		assert.isNull(mic.track);
		assert.isTrue(stream.tracks[0]!.stopped);
		assert.strictEqual(clock.active, 0, 'the probe went with it');
	});

	test('the constraints are read at each start, from the selected device', async () => {
		let device_id = 'mic-a';
		const mic = create_media('mic', {
			track_constraints: () => ({ deviceId: { exact: device_id } })
		});
		await start_with(mic, mic_stream());
		assert.deepEqual(media_devices.requests[0]!.constraints, {
			audio: { deviceId: { exact: 'mic-a' } }
		});
		device_id = 'mic-b';
		const restarted = mic.restart();
		const first = mic.stream;
		assert.isNull(first, 'the old device is released before the new one opens');
		media_devices.requests[1]!.resolve(new FakeStream([new FakeTrack('audio', 'mic-b')]));
		await restarted;
		assert.deepEqual(media_devices.requests[1]!.constraints, {
			audio: { deviceId: { exact: 'mic-b' } }
		});
		assert.strictEqual(mic.device_id, 'mic-b');
	});

	test('without constraints it asks for any mic', async () => {
		const mic = create_media('mic');
		void mic.start();
		assert.deepEqual(media_devices.requests[0]!.constraints, { audio: true });
	});

	test('a permission refusal maps to its reason and returns to off', async () => {
		const mic = create_media('mic');
		const started = mic.start();
		media_devices.requests[0]!.reject(dom_error('NotAllowedError'));
		await started;
		assert.strictEqual(mic.status, 'off');
		assert.strictEqual(mic.error?.reason, 'denied');
		assert.strictEqual(mic.error?.kind, 'mic');
		assert.include(mic.error?.message, 'the mic');
		await start_with(mic, mic_stream());
		assert.isNull(mic.error, 'the next start clears it');
	});

	test('a stop during the permission prompt releases the late stream', async () => {
		const mic = create_media('mic');
		const started = mic.start();
		mic.stop();
		assert.strictEqual(mic.status, 'off');
		const late = mic_stream();
		media_devices.requests[0]!.resolve(late);
		await started;
		assert.strictEqual(mic.status, 'off');
		assert.isNull(mic.stream);
		assert.isTrue(late.tracks[0]!.stopped);
	});

	test('a refusal after a stop is ignored', async () => {
		const mic = create_media('mic');
		const started = mic.start();
		mic.stop();
		media_devices.requests[0]!.reject(dom_error('NotAllowedError'));
		await started;
		assert.isNull(mic.error);
	});

	test('start is a no-op unless off', async () => {
		const mic = create_media('mic');
		void mic.start();
		await mic.start();
		assert.strictEqual(media_devices.requests.length, 1);
	});

	test('the device ending on its own releases it, with a reason', async () => {
		const mic = create_media('mic');
		const stream = mic_stream();
		await start_with(mic, stream);
		stream.tracks[0]!.end();
		assert.strictEqual(mic.status, 'off');
		assert.strictEqual(mic.error?.reason, 'ended');
		assert.isNull(mic.stream);
	});

	test('a stopped track ending or muting later changes nothing', async () => {
		const mic = create_media('mic');
		const old = mic_stream();
		await start_with(mic, old);
		mic.stop();
		await start_with(mic, mic_stream());
		old.tracks[0]!.end();
		old.tracks[0]!.set_muted(true);
		assert.strictEqual(mic.status, 'starting', 'the new start is untouched');
		assert.isNull(mic.error);
		assert.isFalse(mic.track_muted);
	});

	test('follows the track being muted at its source', async () => {
		const mic = create_media('mic');
		const stream = mic_stream();
		await start_with(mic, stream);
		stream.tracks[0]!.set_muted(true);
		assert.isTrue(mic.track_muted);
		stream.tracks[0]!.set_muted(false);
		assert.isFalse(mic.track_muted);
	});

	test('toggle turns it on and off', async () => {
		const mic = create_media('mic');
		const on = mic.toggle();
		media_devices.requests[0]!.resolve(mic_stream());
		await on;
		assert.strictEqual(mic.status, 'starting');
		await mic.toggle();
		assert.strictEqual(mic.status, 'off');
	});

	test('unsupported where the browser has no getUserMedia', async () => {
		const platform = create_local_media_deps(undefined);
		deps.get_user_media = platform.get_user_media;
		const mic = create_media('mic');
		await mic.start();
		assert.strictEqual(mic.status, 'off');
		assert.strictEqual(mic.error?.reason, 'unsupported');
	});
});

describe('LocalMedia camera and screen', () => {
	test('a camera is live on arrival and releases on stop', async () => {
		const camera = create_media('camera', {
			track_constraints: () => ({ width: { ideal: 1280 } })
		});
		const stream = new FakeStream([new FakeTrack('video', 'cam-a')]);
		await start_with(camera, stream);
		assert.deepEqual(media_devices.requests[0]!.constraints, { video: { width: { ideal: 1280 } } });
		assert.strictEqual(camera.status, 'live');
		assert.strictEqual(camera.track, stream.tracks[0] as unknown as MediaStreamTrack);
		clock.advance(LOCAL_MEDIA_SILENT_AFTER);
		assert.isFalse(camera.silent, 'only a mic reads silent');
		camera.stop();
		assert.isTrue(stream.tracks[0]!.stopped);
	});

	test('a screen opens the picker with its options and stops every track', async () => {
		const screen = create_media('screen', {
			display_options: () => ({ video: true, audio: true })
		});
		const video = new FakeTrack('video');
		const audio = new FakeTrack('audio');
		await start_with(screen, new FakeStream([audio, video]));
		assert.deepEqual(media_devices.display_requests[0]!.constraints, { video: true, audio: true });
		assert.strictEqual(screen.status, 'live');
		assert.strictEqual(screen.track, video as unknown as MediaStreamTrack, 'the video track');
		screen.stop();
		assert.isTrue(video.stopped);
		assert.isTrue(audio.stopped);
	});

	test("the browser's stop sharing ends a screen without an error", async () => {
		const screen = create_media('screen');
		const video = new FakeTrack('video');
		const audio = new FakeTrack('audio');
		await start_with(screen, new FakeStream([video, audio]));
		video.end();
		assert.strictEqual(screen.status, 'off');
		assert.isNull(screen.error);
		assert.isTrue(audio.stopped, 'its audio goes too');
	});

	test('a cancelled picker maps to denied', async () => {
		const screen = create_media('screen');
		const started = screen.start();
		media_devices.display_requests[0]!.reject(dom_error('NotAllowedError'));
		await started;
		assert.strictEqual(screen.error?.reason, 'denied');
		assert.include(screen.error?.message, 'cancelled');
	});

	test('the default screen options ask for video only', async () => {
		const screen = create_media('screen');
		void screen.start();
		await flush();
		assert.deepEqual(media_devices.display_requests[0]!.constraints, { video: true, audio: false });
	});
});
