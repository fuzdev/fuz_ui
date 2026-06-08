/**
 * @vitest-environment jsdom
 */
import {describe, test, assert, vi, afterEach} from 'vitest';
import {flushSync} from 'svelte';

import './dialog_test_helpers.js'; // polyfills `<dialog>` modal methods for jsdom
import DialogHarness from './DialogHarness.svelte';
import {mount_component, unmount_component, create_mouse_event} from './test_helpers.js';

let mounted: {instance: any; container: HTMLElement} | null = null;

afterEach(async () => {
	if (mounted) {
		await unmount_component(mounted.instance, mounted.container);
		mounted = null;
	}
});

const mount_harness = (
	dialog_props: Record<string, any> = {},
	content_props: Record<string, any> = {},
): HTMLElement => {
	mounted = mount_component(DialogHarness as any, {dialog_props, content_props});
	flushSync();
	return mounted.container;
};

describe('DialogContent', () => {
	test('renders the default close button', () => {
		const container = mount_harness();
		assert(container.querySelector('button[aria-label="close"]') instanceof HTMLButtonElement);
	});

	test('close_button={false} removes the close button', () => {
		const container = mount_harness({}, {close_button: false});
		assert.equal(container.querySelector('button[aria-label="close"]'), null);
	});

	test('the default close button closes the dialog', () => {
		const onclose = vi.fn();
		const container = mount_harness({onclose});
		const button = container.querySelector('button[aria-label="close"]');
		assert(button instanceof HTMLButtonElement);
		button.dispatchEvent(create_mouse_event('click'));
		flushSync();
		assert.equal(onclose.mock.calls.length, 1);
	});

	test('pane defaults on and is removable with pane={false}', () => {
		assert(mount_harness().querySelector('.pane') instanceof HTMLElement);
	});

	test('pane={false} drops the .pane class but keeps the content', () => {
		const container = mount_harness({}, {pane: false});
		assert.equal(container.querySelector('.pane'), null);
		assert(container.querySelector('[data-testid="content"]') instanceof HTMLElement);
	});

	test('a press inside the registered surface does not close, even with pane={false}', () => {
		const onclose = vi.fn();
		const container = mount_harness({onclose}, {pane: false});
		const content = container.querySelector('[data-testid="content"]');
		assert(content instanceof HTMLElement);
		content.dispatchEvent(create_mouse_event('mousedown'));
		flushSync();
		assert.equal(onclose.mock.calls.length, 0);
	});

	test('a press outside the surface closes', () => {
		const onclose = vi.fn();
		const container = mount_harness({onclose});
		const wrapper = container.querySelector('.dialog-wrapper');
		assert(wrapper instanceof HTMLElement);
		wrapper.dispatchEvent(create_mouse_event('mousedown'));
		flushSync();
		assert.equal(onclose.mock.calls.length, 1);
	});
});
