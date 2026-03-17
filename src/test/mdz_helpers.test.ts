import {test, assert, describe} from 'vitest';

import type {MdzNode, MdzComponentNode, MdzElementNode} from '$lib/mdz.js';
import {
	is_letter,
	is_tag_name_char,
	is_word_char,
	is_valid_path_char,
	trim_trailing_punctuation,
	is_at_absolute_path,
	is_at_relative_path,
	mdz_text_content,
	mdz_heading_id,
	mdz_is_url,
	resolve_relative_path,
	extract_single_tag,
	ASTERISK,
	UNDERSCORE,
	TILDE,
	A_UPPER,
	Z_UPPER,
	A_LOWER,
	Z_LOWER,
	ZERO,
	NINE,
	HYPHEN,
	SPACE,
	LEFT_BRACKET,
	RIGHT_BRACKET,
	LEFT_PAREN,
} from '$lib/mdz_helpers.js';

// helper to create nodes with dummy positions
const text = (content: string): MdzNode => ({type: 'Text', content, start: 0, end: 0});
const bold = (children: Array<MdzNode>): MdzNode => ({type: 'Bold', children, start: 0, end: 0});
const italic = (children: Array<MdzNode>): MdzNode => ({
	type: 'Italic',
	children,
	start: 0,
	end: 0,
});
const code = (content: string): MdzNode => ({type: 'Code', content, start: 0, end: 0});
const link = (reference: string, children: Array<MdzNode>): MdzNode => ({
	type: 'Link',
	reference,
	children,
	link_type: 'external',
	start: 0,
	end: 0,
});
const component = (name: string, children: Array<MdzNode>): MdzComponentNode => ({
	type: 'Component',
	name,
	children,
	start: 0,
	end: 0,
});
const element = (name: string, children: Array<MdzNode>): MdzElementNode => ({
	type: 'Element',
	name,
	children,
	start: 0,
	end: 0,
});

describe('is_letter', () => {
	test('returns true for uppercase letters', () => {
		assert.equal(is_letter(A_UPPER), true); // A
		assert.equal(is_letter(Z_UPPER), true); // Z
		assert.equal(is_letter(77), true); // M
	});

	test('returns true for lowercase letters', () => {
		assert.equal(is_letter(A_LOWER), true); // a
		assert.equal(is_letter(Z_LOWER), true); // z
		assert.equal(is_letter(109), true); // m
	});

	test('returns false for digits', () => {
		assert.equal(is_letter(ZERO), false);
		assert.equal(is_letter(NINE), false);
	});

	test('returns false for boundary characters just outside letter ranges', () => {
		assert.equal(is_letter(A_UPPER - 1), false); // @
		assert.equal(is_letter(Z_UPPER + 1), false); // [
		assert.equal(is_letter(A_LOWER - 1), false); // `
		assert.equal(is_letter(Z_LOWER + 1), false); // {
	});

	test('returns false for symbols', () => {
		assert.equal(is_letter(SPACE), false);
		assert.equal(is_letter(HYPHEN), false);
		assert.equal(is_letter(UNDERSCORE), false);
	});
});

describe('is_tag_name_char', () => {
	test('allows letters', () => {
		assert.equal(is_tag_name_char(A_UPPER), true);
		assert.equal(is_tag_name_char(A_LOWER), true);
	});

	test('allows digits', () => {
		assert.equal(is_tag_name_char(ZERO), true);
		assert.equal(is_tag_name_char(NINE), true);
	});

	test('allows hyphen and underscore', () => {
		assert.equal(is_tag_name_char(HYPHEN), true);
		assert.equal(is_tag_name_char(UNDERSCORE), true);
	});

	test('rejects other symbols', () => {
		assert.equal(is_tag_name_char(SPACE), false);
		assert.equal(is_tag_name_char(ASTERISK), false);
		assert.equal(is_tag_name_char(LEFT_BRACKET), false);
		assert.equal(is_tag_name_char(RIGHT_BRACKET), false);
	});
});

describe('is_word_char', () => {
	test('alphanumeric characters are word chars', () => {
		assert.equal(is_word_char(A_UPPER), true);
		assert.equal(is_word_char(Z_LOWER), true);
		assert.equal(is_word_char(ZERO), true);
		assert.equal(is_word_char(NINE), true);
	});

	test('formatting delimiters are NOT word chars', () => {
		assert.equal(is_word_char(ASTERISK), false);
		assert.equal(is_word_char(UNDERSCORE), false);
		assert.equal(is_word_char(TILDE), false);
	});

	test('other symbols are not word chars', () => {
		assert.equal(is_word_char(SPACE), false);
		assert.equal(is_word_char(HYPHEN), false);
		assert.equal(is_word_char(LEFT_PAREN), false);
	});
});

describe('is_valid_path_char', () => {
	test('allows unreserved characters', () => {
		assert.equal(is_valid_path_char(A_LOWER), true);
		assert.equal(is_valid_path_char(ZERO), true);
		assert.equal(is_valid_path_char(HYPHEN), true);
		assert.equal(is_valid_path_char('.'.charCodeAt(0)), true);
		assert.equal(is_valid_path_char(UNDERSCORE), true);
		assert.equal(is_valid_path_char(TILDE), true);
	});

	test('allows sub-delimiters', () => {
		assert.equal(is_valid_path_char('!'.charCodeAt(0)), true);
		assert.equal(is_valid_path_char('$'.charCodeAt(0)), true);
		assert.equal(is_valid_path_char('&'.charCodeAt(0)), true);
		assert.equal(is_valid_path_char('+'.charCodeAt(0)), true);
		assert.equal(is_valid_path_char('='.charCodeAt(0)), true);
	});

	test('allows path separators and query/fragment', () => {
		assert.equal(is_valid_path_char('/'.charCodeAt(0)), true);
		assert.equal(is_valid_path_char('?'.charCodeAt(0)), true);
		assert.equal(is_valid_path_char('#'.charCodeAt(0)), true);
		assert.equal(is_valid_path_char('%'.charCodeAt(0)), true);
	});

	test('allows parentheses (valid in URI path components)', () => {
		assert.equal(is_valid_path_char(LEFT_PAREN), true);
		assert.equal(is_valid_path_char(')'.charCodeAt(0)), true);
	});

	test('rejects spaces and brackets', () => {
		assert.equal(is_valid_path_char(SPACE), false);
		assert.equal(is_valid_path_char(LEFT_BRACKET), false);
		assert.equal(is_valid_path_char(RIGHT_BRACKET), false);
		assert.equal(is_valid_path_char('{'.charCodeAt(0)), false);
		assert.equal(is_valid_path_char('}'.charCodeAt(0)), false);
	});
});

describe('trim_trailing_punctuation', () => {
	test('trims simple trailing punctuation', () => {
		assert.equal(trim_trailing_punctuation('https://example.com.'), 'https://example.com');
		assert.equal(trim_trailing_punctuation('https://example.com,'), 'https://example.com');
		assert.equal(trim_trailing_punctuation('https://example.com;'), 'https://example.com');
		assert.equal(trim_trailing_punctuation('https://example.com:'), 'https://example.com');
		assert.equal(trim_trailing_punctuation('https://example.com!'), 'https://example.com');
		assert.equal(trim_trailing_punctuation('https://example.com?'), 'https://example.com');
		assert.equal(trim_trailing_punctuation('https://example.com]'), 'https://example.com');
	});

	test('trims multiple trailing punctuation chars', () => {
		assert.equal(trim_trailing_punctuation('https://example.com..'), 'https://example.com');
		assert.equal(trim_trailing_punctuation('https://example.com!?'), 'https://example.com');
	});

	test('returns original string reference when no trimming needed', () => {
		const url = 'https://example.com/path';
		const result = trim_trailing_punctuation(url);
		assert.ok(result === url, 'should return same string reference');
	});

	test('handles balanced parentheses (Wikipedia-style URLs)', () => {
		assert.equal(
			trim_trailing_punctuation('https://en.wikipedia.org/wiki/Foo_(bar)'),
			'https://en.wikipedia.org/wiki/Foo_(bar)',
		);
	});

	test('trims unmatched trailing closing parens', () => {
		assert.equal(trim_trailing_punctuation('https://example.com)'), 'https://example.com');
		assert.equal(trim_trailing_punctuation('https://example.com))'), 'https://example.com');
	});

	test('keeps matched parens but trims excess', () => {
		assert.equal(
			trim_trailing_punctuation('https://example.com/(foo))'),
			'https://example.com/(foo)',
		);
	});

	test('handles empty string', () => {
		assert.equal(trim_trailing_punctuation(''), '');
	});

	test('trims string that is all punctuation', () => {
		assert.equal(trim_trailing_punctuation('.,;:!?'), '');
	});

	test('keeps multiple balanced paren pairs', () => {
		assert.equal(
			trim_trailing_punctuation('https://example.com/(a)(b)'),
			'https://example.com/(a)(b)',
		);
	});

	test('keeps nested balanced parens', () => {
		assert.equal(
			trim_trailing_punctuation('https://en.wikipedia.org/wiki/Foo_(bar_(baz))'),
			'https://en.wikipedia.org/wiki/Foo_(bar_(baz))',
		);
	});

	test('trims punctuation after parens', () => {
		assert.equal(
			trim_trailing_punctuation('https://example.com/(foo).'),
			'https://example.com/(foo)',
		);
	});
});

describe('is_at_absolute_path', () => {
	test('detects path at start of string', () => {
		assert.equal(is_at_absolute_path('/foo/bar', 0), true);
	});

	test('detects path after space', () => {
		assert.equal(is_at_absolute_path('see /foo/bar', 4), true);
	});

	test('detects path after newline', () => {
		assert.equal(is_at_absolute_path('see\n/foo', 4), true);
	});

	test('detects path after tab', () => {
		assert.equal(is_at_absolute_path('see\t/foo', 4), true);
	});

	test('rejects double slash (protocol-relative or comment)', () => {
		assert.equal(is_at_absolute_path('//foo', 0), false);
	});

	test('rejects slash followed by space', () => {
		assert.equal(is_at_absolute_path('/ foo', 0), false);
	});

	test('rejects slash followed by newline', () => {
		assert.equal(is_at_absolute_path('/\n', 0), false);
	});

	test('rejects slash followed by tab', () => {
		assert.equal(is_at_absolute_path('/\tfoo', 0), false);
	});

	test('rejects slash at end of string', () => {
		assert.equal(is_at_absolute_path('/', 0), false);
	});

	test('rejects slash not preceded by whitespace', () => {
		assert.equal(is_at_absolute_path('x/foo', 1), false);
	});

	test('rejects non-slash character', () => {
		assert.equal(is_at_absolute_path('foo', 0), false);
	});
});

describe('is_at_relative_path', () => {
	test('detects ./ path at start of string', () => {
		assert.equal(is_at_relative_path('./foo', 0), true);
	});

	test('detects ../ path at start of string', () => {
		assert.equal(is_at_relative_path('../foo', 0), true);
	});

	test('detects ./ path after space', () => {
		assert.equal(is_at_relative_path('see ./foo', 4), true);
	});

	test('detects ../ path after newline', () => {
		assert.equal(is_at_relative_path('see\n../foo', 4), true);
	});

	test('rejects ./ without following path char', () => {
		assert.equal(is_at_relative_path('./', 0), false);
	});

	test('rejects ../ without following path char', () => {
		assert.equal(is_at_relative_path('../', 0), false);
	});

	test('rejects ./ followed by space', () => {
		assert.equal(is_at_relative_path('./ foo', 0), false);
	});

	test('rejects ../ followed by slash', () => {
		assert.equal(is_at_relative_path('..//', 0), false);
	});

	test('rejects ../ followed by space', () => {
		assert.equal(is_at_relative_path('../ foo', 0), false);
	});

	test('rejects ../ followed by newline', () => {
		assert.equal(is_at_relative_path('../\n', 0), false);
	});

	test('rejects ../ followed by tab', () => {
		assert.equal(is_at_relative_path('../\tfoo', 0), false);
	});

	test('rejects period not preceded by whitespace', () => {
		assert.equal(is_at_relative_path('x./foo', 1), false);
	});

	test('rejects bare period', () => {
		assert.equal(is_at_relative_path('.', 0), false);
	});

	test('rejects ./ followed by newline', () => {
		assert.equal(is_at_relative_path('./\n', 0), false);
	});

	test('rejects ./ followed by tab', () => {
		assert.equal(is_at_relative_path('./\tfoo', 0), false);
	});

	test('rejects non-period character', () => {
		assert.equal(is_at_relative_path('foo', 0), false);
	});
});

describe('mdz_text_content', () => {
	test('extracts text from text nodes', () => {
		assert.equal(mdz_text_content([text('hello')]), 'hello');
	});

	test('concatenates multiple text nodes', () => {
		assert.equal(mdz_text_content([text('hello'), text(' world')]), 'hello world');
	});

	test('recurses into children (bold)', () => {
		assert.equal(mdz_text_content([bold([text('bold text')])]), 'bold text');
	});

	test('recurses into nested formatting', () => {
		assert.equal(
			mdz_text_content([bold([text('bold '), italic([text('and italic')])])]),
			'bold and italic',
		);
	});

	test('extracts content from code nodes', () => {
		assert.equal(mdz_text_content([text('see '), code('foo'), text(' here')]), 'see foo here');
	});

	test('returns empty string for empty array', () => {
		assert.equal(mdz_text_content([]), '');
	});

	test('returns empty string for nodes without content or children', () => {
		const hr: MdzNode = {type: 'Hr', start: 0, end: 0};
		assert.equal(mdz_text_content([hr]), '');
	});

	test('recurses into Link children, not reference', () => {
		assert.equal(
			mdz_text_content([link('https://example.com', [text('click here')])]),
			'click here',
		);
	});

	test('skips Hr nodes interspersed with text', () => {
		const hr: MdzNode = {type: 'Hr', start: 0, end: 0};
		assert.equal(mdz_text_content([text('before'), hr, text('after')]), 'beforeafter');
	});
});

describe('mdz_heading_id', () => {
	test('generates slug from plain text', () => {
		assert.equal(mdz_heading_id([text('Hello World')]), 'hello-world');
	});

	test('lowercases the slug', () => {
		assert.equal(mdz_heading_id([text('UPPERCASE')]), 'uppercase');
	});

	test('strips formatting and uses text content', () => {
		assert.equal(mdz_heading_id([bold([text('Bold')]), text(' text')]), 'bold-text');
	});

	test('handles code in headings', () => {
		assert.equal(
			mdz_heading_id([text('The '), code('foo'), text(' function')]),
			'the-foo-function',
		);
	});
});

describe('mdz_is_url', () => {
	test('returns true for valid URLs', () => {
		assert.equal(mdz_is_url('https://example.com'), true);
		assert.equal(mdz_is_url('https://a'), true);
		assert.equal(mdz_is_url('http://example.com'), true);
		assert.equal(mdz_is_url('http://a'), true);
		assert.equal(mdz_is_url('https://example.com/path?query=1#hash'), true);
	});

	test('returns true for IPv6 URLs', () => {
		assert.equal(mdz_is_url('https://[::1]'), true);
		assert.equal(mdz_is_url('https://[2001:db8::1]:8080/path'), true);
		assert.equal(mdz_is_url('http://[::1]/'), true);
	});

	test('returns true for internationalized domain names', () => {
		assert.equal(mdz_is_url('https://例え.jp'), true);
		assert.equal(mdz_is_url('https://münchen.de'), true);
		assert.equal(mdz_is_url('https://пример.рф'), true);
	});

	test('returns false for bare protocols', () => {
		assert.equal(mdz_is_url('https://'), false);
		assert.equal(mdz_is_url('http://'), false);
	});

	test('returns false for protocols followed by whitespace', () => {
		assert.equal(mdz_is_url('https:// '), false);
		assert.equal(mdz_is_url('https://\n'), false);
		assert.equal(mdz_is_url('https://\t'), false);
		assert.equal(mdz_is_url('http:// '), false);
		assert.equal(mdz_is_url('http://\n'), false);
	});

	test('returns false for protocols followed by invalid start chars', () => {
		assert.equal(mdz_is_url('https://)'), false);
		assert.equal(mdz_is_url('https://]'), false);
		assert.equal(mdz_is_url('https://}'), false);
		assert.equal(mdz_is_url('https://<'), false);
		assert.equal(mdz_is_url('https://>'), false);
		assert.equal(mdz_is_url('https://.'), false);
		assert.equal(mdz_is_url('https://,'), false);
		assert.equal(mdz_is_url('https://:'), false);
		assert.equal(mdz_is_url('https:///'), false);
		assert.equal(mdz_is_url('https://?'), false);
		assert.equal(mdz_is_url('https://#'), false);
		assert.equal(mdz_is_url('https://!'), false);
		assert.equal(mdz_is_url('http://)foo'), false);
		assert.equal(mdz_is_url('https://.com'), false);
	});

	test('returns false for non-URLs', () => {
		assert.equal(mdz_is_url(''), false);
		assert.equal(mdz_is_url('example.com'), false);
		assert.equal(mdz_is_url('/path'), false);
		assert.equal(mdz_is_url('ftp://example.com'), false);
	});
});

describe('resolve_relative_path', () => {
	test('resolves ./ path', () => {
		assert.equal(resolve_relative_path('./grammar', '/docs/mdz/'), '/docs/mdz/grammar');
	});

	test('resolves ../ path', () => {
		assert.equal(resolve_relative_path('../mdz', '/docs/mdz/'), '/docs/mdz');
	});

	test('resolves nested ./ path', () => {
		assert.equal(resolve_relative_path('./a/b/c', '/docs/mdz/'), '/docs/mdz/a/b/c');
	});

	test('resolves multiple ../ segments', () => {
		assert.equal(resolve_relative_path('../../foo', '/docs/mdz/'), '/foo');
	});

	test('normalizes base without trailing slash', () => {
		assert.equal(resolve_relative_path('./grammar', '/docs/mdz'), '/docs/mdz/grammar');
	});

	test('normalizes base without trailing slash for ../', () => {
		assert.equal(resolve_relative_path('../foo', '/docs/mdz'), '/docs/foo');
	});

	test('clamps at root', () => {
		assert.equal(resolve_relative_path('../../../foo', '/docs/'), '/foo');
	});

	test('handles embedded .. segments', () => {
		assert.equal(resolve_relative_path('./a/../b', '/docs/mdz/'), '/docs/mdz/b');
	});

	test('handles embedded . segments', () => {
		assert.equal(resolve_relative_path('./a/./b', '/docs/mdz/'), '/docs/mdz/a/b');
	});

	test('resolves to base directory for ../dirname', () => {
		assert.equal(resolve_relative_path('../mdz', '/docs/mdz/'), '/docs/mdz');
	});

	test('handles root base', () => {
		assert.equal(resolve_relative_path('./foo', '/'), '/foo');
	});

	test('handles root base with ../ clamped', () => {
		assert.equal(resolve_relative_path('../foo', '/'), '/foo');
	});

	test('handles multiple embedded ..', () => {
		assert.equal(resolve_relative_path('./a/b/../../c', '/docs/mdz/'), '/docs/mdz/c');
	});

	test('preserves trailing slash in reference', () => {
		assert.equal(resolve_relative_path('./foo/', '/docs/mdz/'), '/docs/mdz/foo/');
	});

	test('handles deeply nested base', () => {
		assert.equal(resolve_relative_path('../bar', '/a/b/c/d/e/'), '/a/b/c/d/bar');
	});

	test('handles empty base', () => {
		assert.equal(resolve_relative_path('./foo', ''), '/foo');
	});

	test('skips internal double slashes', () => {
		assert.equal(resolve_relative_path('.//foo', '/docs/mdz/'), '/docs/mdz/foo');
	});
});

describe('extract_single_tag', () => {
	test('returns component node when it is the only node', () => {
		const comp = component('Alert', [text('warning')]);
		assert.equal(extract_single_tag([comp]), comp);
	});

	test('returns element node when it is the only node', () => {
		const el = element('div', [text('content')]);
		assert.equal(extract_single_tag([el]), el);
	});

	test('allows surrounding whitespace-only text nodes', () => {
		const comp = component('Alert', []);
		assert.equal(extract_single_tag([text('  '), comp, text('\n')]), comp);
	});

	test('returns null for multiple tags', () => {
		assert.equal(extract_single_tag([component('A', []), component('B', [])]), null);
	});

	test('returns null when non-whitespace text is present', () => {
		assert.equal(extract_single_tag([text('hello'), component('Alert', [])]), null);
	});

	test('returns null for non-tag node types', () => {
		assert.equal(extract_single_tag([bold([text('bold')])]), null);
	});

	test('returns null for code node (has content but is not a tag)', () => {
		assert.equal(extract_single_tag([code('foo')]), null);
	});

	test('returns null for Link node (has children but is not a tag)', () => {
		assert.equal(extract_single_tag([link('https://example.com', [text('link')])]), null);
	});

	test('returns null for mixed component and element', () => {
		assert.equal(extract_single_tag([component('Alert', []), element('div', [])]), null);
	});

	test('returns null for empty array', () => {
		assert.equal(extract_single_tag([]), null);
	});

	test('returns null for only whitespace text nodes', () => {
		assert.equal(extract_single_tag([text('  '), text('\n')]), null);
	});
});
