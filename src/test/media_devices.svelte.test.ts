import { describe, test, assert, beforeEach } from 'vitest';

import {
	MediaDevicesState,
	create_media_devices_state_deps,
	type MediaDeviceSelection
} from '#lib/media_devices.svelte.ts';

import {
	FakeMediaDevices,
	FakePermissionStatus,
	FakePermissions,
	dom_error,
	fake_device,
	flush
} from './media_test_helpers.ts';

let media_devices: FakeMediaDevices;
let permissions: FakePermissions;
let saved: Array<MediaDeviceSelection>;

const create_state = (initial_selection?: Partial<MediaDeviceSelection>): MediaDevicesState =>
	new MediaDevicesState({
		deps: create_media_devices_state_deps(
			media_devices.as_media_devices(),
			permissions.as_permissions()
		),
		initial_selection,
		on_select: (selection) => saved.push(selection)
	});

const LABELED = [
	fake_device('audioinput', 'mic-a'),
	fake_device('audioinput', 'mic-b'),
	fake_device('videoinput', 'cam-a'),
	fake_device('audiooutput', 'out-a')
];

// before a permission, Chromium lists one blank entry per kind
const BLANK = [
	fake_device('audioinput', '', ''),
	fake_device('videoinput', '', ''),
	fake_device('audiooutput', '', '')
];

beforeEach(() => {
	media_devices = new FakeMediaDevices();
	permissions = new FakePermissions();
	saved = [];
});

describe('MediaDevicesState devices', () => {
	test('reads nothing until asked, then splits the list by kind', async () => {
		media_devices.devices = LABELED;
		const state = create_state();
		assert.isTrue(state.supported);
		assert.deepEqual(state.devices, []);
		await state.refresh();
		assert.deepEqual(
			state.audio_inputs.map((d) => d.deviceId),
			['mic-a', 'mic-b']
		);
		assert.deepEqual(
			state.video_inputs.map((d) => d.deviceId),
			['cam-a']
		);
		assert.deepEqual(
			state.audio_outputs.map((d) => d.deviceId),
			['out-a']
		);
		assert.isTrue(state.labeled);
	});

	test('a blank list is not labeled', async () => {
		media_devices.devices = BLANK;
		const state = create_state();
		await state.refresh();
		assert.isFalse(state.labeled);
	});

	test('unsupported without mediaDevices', async () => {
		const state = new MediaDevicesState({
			deps: create_media_devices_state_deps(undefined, undefined)
		});
		assert.isFalse(state.supported);
		assert.isFalse(state.can_pick_audio_output);
		await state.refresh();
		assert.deepEqual(state.devices, []);
		assert.strictEqual(state.microphone_permission, 'unknown');
		state.listen()();
	});

	test('listen follows devicechange until stopped', async () => {
		const state = create_state();
		const stop = state.listen();
		await flush();
		media_devices.set_devices(LABELED);
		await flush();
		assert.strictEqual(state.devices.length, LABELED.length);
		stop();
		media_devices.set_devices([]);
		await flush();
		assert.strictEqual(state.devices.length, LABELED.length, 'no longer listening');
	});

	test('a slow refresh never overwrites a newer one', async () => {
		const state = create_state();
		const resolvers: Array<(devices: Array<MediaDeviceInfo>) => void> = [];
		media_devices.enumerateDevices = () => new Promise((resolve) => resolvers.push(resolve));
		const first = state.refresh_devices();
		const second = state.refresh_devices();
		resolvers[1]!(LABELED);
		await second;
		resolvers[0]!([]);
		await first;
		assert.strictEqual(state.devices.length, LABELED.length);
	});
});

describe('MediaDevicesState permissions', () => {
	test('reads each permission, unknown where the browser can not query it', async () => {
		permissions.statuses.set('microphone', new FakePermissionStatus('granted'));
		const state = create_state();
		await state.refresh_permissions();
		assert.strictEqual(state.microphone_permission, 'granted');
		assert.strictEqual(state.camera_permission, 'unknown');
	});

	test('while listening, follows a change and re-reads the now-labeled devices', async () => {
		const mic = new FakePermissionStatus('prompt');
		permissions.statuses.set('microphone', mic);
		permissions.statuses.set('camera', new FakePermissionStatus('prompt'));
		media_devices.devices = BLANK;
		const state = create_state();
		const stop = state.listen();
		await flush();
		assert.strictEqual(state.microphone_permission, 'prompt');
		assert.isFalse(state.labeled);
		media_devices.devices = LABELED;
		mic.set('granted');
		await flush();
		assert.strictEqual(state.microphone_permission, 'granted');
		assert.isTrue(state.labeled);
		stop();
		mic.set('denied');
		assert.strictEqual(state.microphone_permission, 'granted', 'no longer listening');
	});

	test('two listeners: permissions are followed until the last one stops', async () => {
		const mic = new FakePermissionStatus('prompt');
		permissions.statuses.set('microphone', mic);
		const state = create_state();
		const stop_a = state.listen();
		const stop_b = state.listen();
		await flush();
		stop_a();
		stop_a();
		mic.set('granted');
		assert.strictEqual(state.microphone_permission, 'granted', 'the second still follows');
		media_devices.set_devices(LABELED);
		await flush();
		assert.strictEqual(state.devices.length, LABELED.length);
		await state.refresh_permissions();
		mic.set('denied');
		assert.strictEqual(state.microphone_permission, 'denied', 'a refresh keeps following');
		stop_b();
		mic.set('prompt');
		assert.strictEqual(state.microphone_permission, 'denied', 'the last stop drops them');
	});

	test('a refresh while listening swaps the followed statuses', async () => {
		let mic = new FakePermissionStatus('prompt');
		permissions.statuses.set('microphone', mic);
		const state = create_state();
		state.listen();
		await flush();
		const old_mic = mic;
		mic = new FakePermissionStatus('granted');
		permissions.statuses.set('microphone', mic);
		await state.refresh_permissions();
		old_mic.set('denied');
		assert.strictEqual(state.microphone_permission, 'granted', 'the old status is dropped');
		mic.set('denied');
		assert.strictEqual(state.microphone_permission, 'denied');
	});
});

describe('MediaDevicesState selection', () => {
	test('select changes the pick and hands it to on_select once', () => {
		const state = create_state({ audiooutput: 'out-a' });
		assert.deepEqual(state.selection, { audioinput: '', videoinput: '', audiooutput: 'out-a' });
		state.select('audioinput', 'mic-b');
		state.select('audioinput', 'mic-b');
		assert.deepEqual(saved, [{ audioinput: 'mic-b', videoinput: '', audiooutput: 'out-a' }]);
	});

	test('a listed pick is asked for exactly', async () => {
		media_devices.devices = LABELED;
		const state = create_state({ audioinput: 'mic-b' });
		await state.refresh();
		assert.strictEqual(state.selected('audioinput')?.deviceId, 'mic-b');
		assert.deepEqual(state.to_device_constraint('audioinput'), { exact: 'mic-b' });
		assert.isFalse(state.missing('audioinput'));
		assert.isUndefined(state.to_device_constraint('videoinput'), 'the default asks for nothing');
	});

	test('a pick the list can not vouch for yet is asked for as ideal', async () => {
		media_devices.devices = BLANK;
		const state = create_state({ audioinput: 'mic-b' });
		await state.refresh();
		assert.deepEqual(state.to_device_constraint('audioinput'), { ideal: 'mic-b' });
		assert.isFalse(state.missing('audioinput'), 'unknown, not missing');
	});

	test('a kind the browser has not revealed yet is unknown, not away', async () => {
		// the mic granted, the camera not: the audio devices are labeled, the camera blank
		media_devices.devices = [
			fake_device('audioinput', 'mic-a'),
			fake_device('audiooutput', 'out-a'),
			fake_device('videoinput', '', '')
		];
		const state = create_state({ videoinput: 'cam-b', audioinput: 'mic-gone' });
		await state.refresh();
		assert.isTrue(state.labeled);
		assert.isTrue(state.labeled_for('audioinput'));
		assert.isFalse(state.labeled_for('videoinput'));
		assert.deepEqual(state.to_device_constraint('videoinput'), { ideal: 'cam-b' });
		assert.isFalse(state.missing('videoinput'));
		assert.isTrue(state.missing('audioinput'), 'a labeled kind still knows a device is away');
		assert.isUndefined(state.to_device_constraint('audioinput'));
	});

	test('a device removed while selected falls back to the default and returns with it', async () => {
		media_devices.devices = LABELED;
		const state = create_state({ audioinput: 'mic-b' });
		const stop = state.listen();
		await flush();
		media_devices.set_devices(LABELED.filter((d) => d.deviceId !== 'mic-b'));
		await flush();
		assert.isTrue(state.missing('audioinput'));
		assert.isNull(state.selected('audioinput'));
		assert.isUndefined(state.to_device_constraint('audioinput'), 'opening it never fails');
		assert.strictEqual(state.selection.audioinput, 'mic-b', 'the pick is kept');
		media_devices.set_devices(LABELED);
		await flush();
		assert.isFalse(state.missing('audioinput'));
		assert.deepEqual(state.to_device_constraint('audioinput'), { exact: 'mic-b' });
		assert.deepEqual(saved, [], 'nothing re-saved');
		stop();
	});
});

describe('MediaDevicesState.pick_audio_output', () => {
	test('picks the device the person chose', async () => {
		const chosen = fake_device('audiooutput', 'out-b');
		Object.assign(media_devices, {
			selectAudioOutput: () => {
				media_devices.devices = [...LABELED, chosen];
				return Promise.resolve(chosen);
			}
		});
		const state = create_state();
		assert.isTrue(state.can_pick_audio_output);
		const result = await state.pick_audio_output();
		assert.ok(result.ok);
		assert.strictEqual(result.device, chosen);
		assert.strictEqual(state.selection.audiooutput, 'out-b');
		assert.isNotNull(state.selected('audiooutput'), 'the list was re-read');
	});

	test('a refusal maps to its reason', async () => {
		Object.assign(media_devices, {
			selectAudioOutput: () => Promise.reject(dom_error('NotAllowedError'))
		});
		const state = create_state();
		const result = await state.pick_audio_output();
		assert.ok(!result.ok);
		assert.strictEqual(result.error.reason, 'denied');
		assert.strictEqual(result.error.kind, 'output');
		assert.strictEqual(state.selection.audiooutput, '');
	});

	test('unsupported where the browser has no picker', async () => {
		const state = create_state();
		assert.isFalse(state.can_pick_audio_output);
		const result = await state.pick_audio_output();
		assert.ok(!result.ok);
		assert.strictEqual(result.error.reason, 'unsupported');
	});
});
