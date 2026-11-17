import { assert, describe, test } from 'vitest';

import { href_contains_current_page, href_is_current_page } from '#lib/page_helpers.ts';

const url = new URL('https://fuz.dev/docs/Card?q=1#top');

describe('href_is_current_page', () => {
	test('the same pathname is the current page', () => {
		assert.ok(href_is_current_page('/docs/Card', url));
		assert.ok(href_is_current_page('https://fuz.dev/docs/Card', url));
	});

	test('a trailing slash, query, or hash is ignored', () => {
		assert.ok(href_is_current_page('/docs/Card/', url));
		assert.ok(href_is_current_page('/docs/Card?q=2', url));
		assert.ok(href_is_current_page('/docs/Card#usage', url));
		assert.ok(href_is_current_page('#usage', url));
		assert.ok(href_is_current_page('/', new URL('https://fuz.dev/')));
		assert.ok(href_is_current_page('/docs', new URL('https://fuz.dev/docs/')));
	});

	test('a relative href resolves against the url', () => {
		assert.ok(href_is_current_page('Card', url));
		assert.ok(href_is_current_page('./Card', url));
		assert.ok(!href_is_current_page('Alert', url));
	});

	test('another pathname is not the current page', () => {
		assert.ok(!href_is_current_page('/docs', url));
		assert.ok(!href_is_current_page('/docs/Card/more', url));
		assert.ok(!href_is_current_page('/docs/Cards', url));
		assert.ok(!href_is_current_page('/', url));
	});

	test('another origin is not the current page', () => {
		assert.ok(!href_is_current_page('https://example.com/docs/Card', url));
		assert.ok(!href_is_current_page('//example.com/docs/Card', url));
		assert.ok(!href_is_current_page('http://fuz.dev/docs/Card', url));
		assert.ok(!href_is_current_page('mailto:a@fuz.dev', url));
	});

	test('an href that is not a url is not the current page', () => {
		assert.ok(!href_is_current_page('http://', url));
	});
});

describe('href_contains_current_page', () => {
	const url = new URL('https://fuz.dev/docs/api/');

	test('contains the page itself and its ancestors by segment', () => {
		assert.isTrue(href_contains_current_page('/docs/api', url));
		assert.isTrue(href_contains_current_page('/docs', url));
		assert.isTrue(href_contains_current_page('/docs/', url));
		assert.isTrue(href_contains_current_page('/', url));
	});

	test('not a sibling that shares a prefix, nor a descendant', () => {
		assert.isFalse(href_contains_current_page('/doc', url));
		assert.isFalse(href_contains_current_page('/docs/ap', url));
		assert.isFalse(href_contains_current_page('/docs/api/Docs.svelte', url));
	});

	test('relative hrefs resolve against the url, as a browser resolves them', () => {
		assert.isTrue(href_contains_current_page('..', url));
		assert.isTrue(href_contains_current_page('./', url));
		assert.isFalse(href_contains_current_page('../tools', url));
	});

	test('another origin or an invalid href is never current', () => {
		assert.isFalse(href_contains_current_page('https://example.com/docs', url));
		assert.isFalse(href_contains_current_page('http://[', url));
	});
});
