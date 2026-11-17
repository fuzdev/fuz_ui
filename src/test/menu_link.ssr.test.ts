/**
 * Server-render tests for `MenuLink` — the `selected` class and
 * `aria-current` the prerendered page ships before hydration, including for
 * the relative hrefs `resolve` returns on the server.
 *
 * @module
 */

import { describe, test, assert, vi, beforeEach } from 'vitest';
import { createRawSnippet } from 'svelte';
import { render } from 'svelte/server';

const app_state = vi.hoisted(() => ({ page: { url: new URL('https://fuz.dev/admin/repos') } }));
vi.mock('$app/state', () => app_state);

import MenuLink from '#lib/MenuLink.svelte';

const children = createRawSnippet(() => ({ render: () => '<span>link</span>' }));

const render_link = (props: Record<string, unknown>): string =>
	render(MenuLink, { props: { children, ...props } as any }).body;

const set_page = (pathname: string): void => {
	app_state.page.url = new URL(pathname, 'https://fuz.dev');
};

describe('MenuLink server render', () => {
	beforeEach(() => set_page('/admin/repos'));

	test('an unrelated link is neither selected nor current', () => {
		const html = render_link({ href: '/tools' });
		assert.notMatch(html, /\bselected\b/);
		assert.notInclude(html, 'aria-current');
	});

	test('the current page is selected and current', () => {
		const html = render_link({ href: '/admin/repos' });
		assert.match(html, /class="[^"]*\bselected\b/);
		assert.include(html, 'aria-current="page"');
	});

	test('an ancestor is selected but not current', () => {
		const html = render_link({ href: '/admin' });
		assert.match(html, /class="[^"]*\bselected\b/);
		assert.notInclude(html, 'aria-current');
	});

	test('`exact` selects only the page itself', () => {
		assert.notMatch(render_link({ href: '/admin', exact: true }), /\bselected\b/);
		assert.match(render_link({ href: '/admin/repos', exact: true }), /\bselected\b/);
	});

	test('a relative href, as `resolve` returns on the server, still matches', () => {
		set_page('/admin');
		assert.include(render_link({ href: './admin' }), 'aria-current="page"');
		set_page('/admin/repos');
		assert.match(render_link({ href: '.' }), /\bselected\b/);
	});

	test('`selected` overrides the derived state both ways', () => {
		assert.notMatch(render_link({ href: '/admin', selected: false }), /\bselected\b/);
		assert.match(render_link({ href: '/tools', selected: true }), /\bselected\b/);
	});

	test('a passed class merges with `selected`', () => {
		const html = render_link({ href: '/admin', class: 'menuitem selected-ish' });
		assert.match(html, /class="[^"]*\bmenuitem\b/);
		assert.match(html, /\bselected-ish\b/);
		assert.match(html, /class="[^"]*\bselected\b/);
	});
});
