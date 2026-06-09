import {test, assert, describe, beforeAll} from 'vitest';

import {MdzStreamParser} from '$lib/mdz_stream_parser.js';
import {mdz_opcodes_to_nodes} from '$lib/mdz_opcodes_to_nodes.js';
import {mdz_parse, type MdzNode} from '$lib/mdz.js';
import type {
	MdzOpcode,
	MdzOpcodeOpen,
	MdzOpcodeClose,
	MdzOpcodeText,
	MdzOpcodeAppendText,
	MdzOpcodeVoid,
	MdzOpcodeRevert,
	MdzOpcodeWrap,
} from '$lib/mdz_opcodes.js';
import {stream_parse, load_fixtures, type MdzFixture} from './fixtures/mdz/mdz_test_helpers.js';

/**
 * Collect all opcodes from feeding text to the streaming parser.
 */
const collect_opcodes = (text: string): Array<MdzOpcode> => {
	const parser = new MdzStreamParser();
	parser.feed(text);
	parser.finish();
	return parser.take_opcodes();
};

// -- Basic opcode tests --

describe('MdzStreamParser opcodes', () => {
	test('plain text produces paragraph with text', () => {
		const ops = collect_opcodes('hello');
		assert.ok(ops.length >= 3);
		// should have open(Paragraph), text("hello"), close(Paragraph)
		const open = ops.find(
			(o): o is MdzOpcodeOpen => o.type === 'open' && o.node_type === 'Paragraph',
		);
		assert.ok(open);
		const text = ops.find((o): o is MdzOpcodeText => o.type === 'text' && o.content === 'hello');
		assert.ok(text);
		assert.equal(text.text_type, 'Text');
		const close = ops.find((o): o is MdzOpcodeClose => o.type === 'close' && o.id === open.id);
		assert.ok(close);
	});

	test('bold produces open/text/close opcodes', () => {
		const ops = collect_opcodes('**bold**');
		const bold_open = ops.find(
			(o): o is MdzOpcodeOpen => o.type === 'open' && o.node_type === 'Bold',
		);
		assert.ok(bold_open);
		const bold_close = ops.find(
			(o): o is MdzOpcodeClose => o.type === 'close' && o.id === bold_open.id,
		);
		assert.ok(bold_close);
	});

	test('inline code produces text opcode with Code type', () => {
		const ops = collect_opcodes('`code`');
		const code_text = ops.find(
			(o): o is MdzOpcodeText => o.type === 'text' && o.text_type === 'Code',
		);
		assert.ok(code_text);
		assert.equal(code_text.content, 'code');
	});

	test('paragraph break produces two paragraphs', () => {
		const ops = collect_opcodes('a\n\nb');
		const para_opens = ops.filter(
			(o): o is MdzOpcodeOpen => o.type === 'open' && o.node_type === 'Paragraph',
		);
		assert.equal(para_opens.length, 2);
	});

	test('heading produces open/close with level', () => {
		const ops = collect_opcodes('## Title');
		const heading_open = ops.find(
			(o): o is MdzOpcodeOpen => o.type === 'open' && o.node_type === 'Heading',
		);
		assert.ok(heading_open);
		assert.equal(heading_open.level, 2);
	});

	test('horizontal rule produces void opcode', () => {
		const ops = collect_opcodes('---\n');

		const hr = ops.find((o): o is MdzOpcodeVoid => o.type === 'void' && o.node_type === 'Hr');
		assert.ok(hr);
	});

	test('unclosed bold at EOF reverts', () => {
		const ops = collect_opcodes('**unclosed');
		const revert = ops.find(
			(o): o is MdzOpcodeRevert => o.type === 'revert' && o.replacement_text === '**',
		);
		assert.ok(revert);
	});

	test('append_text extends existing text node', () => {
		// feed in chunks to trigger append_text
		const parser = new MdzStreamParser();
		parser.feed('hel');
		parser.take_opcodes(); // drain first batch
		parser.feed('lo');
		parser.finish();
		const ops = parser.take_opcodes();
		const append = ops.find((o): o is MdzOpcodeAppendText => o.type === 'append_text');
		assert.ok(append);
		assert.equal(append.content, 'lo');
	});

	test('link produces open/text/close with reference', () => {
		const ops = collect_opcodes('[text](url)');
		const link_open = ops.find(
			(o): o is MdzOpcodeOpen => o.type === 'open' && o.node_type === 'Link',
		);
		assert.ok(link_open);
		const link_close = ops.find(
			(o): o is MdzOpcodeClose => o.type === 'close' && o.id === link_open.id,
		);
		assert.ok(link_close);
		assert.equal(link_close.reference, 'url');
		assert.equal(link_close.link_type, 'internal');
	});

	test('tags produce open/close opcodes', () => {
		const ops = collect_opcodes('<Alert>content</Alert>');
		const tag_open = ops.find(
			(o): o is MdzOpcodeOpen => o.type === 'open' && o.node_type === 'Component',
		);
		assert.ok(tag_open);
		assert.equal(tag_open.name, 'Alert');
		const tag_close = ops.find(
			(o): o is MdzOpcodeClose => o.type === 'close' && o.id === tag_open.id,
		);
		assert.ok(tag_close);
	});

	test('closing tag at EOF is handled (not literal text)', () => {
		const result = stream_parse('<Alert>content</Alert>');
		assert.equal(result.length, 1);
		assert.equal(result[0]!.type, 'Component');
	});

	test('closing tag at EOF via chunked feed', () => {
		const parser = new MdzStreamParser();
		parser.feed('<Alert>con');
		parser.feed('tent</Alert>');
		parser.finish();
		const result = mdz_opcodes_to_nodes(parser.take_opcodes());
		assert.equal(result.length, 1);
		assert.equal(result[0]!.type, 'Component');
	});

	test('revert re-parents children to grandparent', () => {
		// unclosed bold inside paragraph — children should end up in paragraph
		const result = stream_parse('**hello');
		assert.equal(result.length, 1);
		assert.equal(result[0]!.type, 'Paragraph');
		const para = result[0] as {children: Array<MdzNode>};
		assert.ok(para.children.length >= 1);
		const all_text = para.children.every((c) => c.type === 'Text');
		assert.ok(all_text);
		const full_text = para.children.map((c) => ('content' in c ? c.content : '')).join('');
		assert.equal(full_text, '**hello');
	});

	// -- Optimistic codeblock streaming --

	test('codeblock open is emitted immediately on opening fence', () => {
		const parser = new MdzStreamParser();
		parser.feed('```ts\n');
		const ops = parser.take_opcodes();
		const cb_open = ops.find(
			(o): o is MdzOpcodeOpen => o.type === 'open' && o.node_type === 'Codeblock',
		);
		assert.ok(cb_open, 'open(Codeblock) should be emitted before closing fence arrives');
		assert.equal(cb_open.lang, 'ts');
	});

	test('codeblock content streams across chunks', () => {
		const parser = new MdzStreamParser();
		parser.feed('```js\n');
		const ops1 = parser.take_opcodes();
		const cb_open = ops1.find(
			(o): o is MdzOpcodeOpen => o.type === 'open' && o.node_type === 'Codeblock',
		);
		assert.ok(cb_open);

		parser.feed('const x = 1;\n');
		const ops2 = parser.take_opcodes();
		const has_content = ops2.some(
			(o) => (o.type === 'text' || o.type === 'append_text') && o.content.includes('const x'),
		);
		assert.ok(has_content, 'content should stream before closing fence');

		parser.feed('```\n');
		const ops3 = parser.take_opcodes();
		const cb_close = ops3.find(
			(o): o is MdzOpcodeClose => o.type === 'close' && o.id === cb_open.id,
		);
		assert.ok(cb_close, 'close should arrive with closing fence chunk');
	});

	test('empty codeblock reverts to paragraph text', () => {
		const result = stream_parse('```\n```\n');
		assert.deepEqual(result, mdz_parse('```\n```\n'));
	});

	test('unclosed codeblock at EOF reverts to paragraph text', () => {
		const result = stream_parse('```ts\nconst x = 1;');
		assert.deepEqual(result, mdz_parse('```ts\nconst x = 1;'));
	});

	test('fence count mismatch across chunks reverts at EOF', () => {
		const parser = new MdzStreamParser();
		parser.feed('````\n');
		const ops1 = parser.take_opcodes();
		const cb_open = ops1.find(
			(o): o is MdzOpcodeOpen => o.type === 'open' && o.node_type === 'Codeblock',
		);
		assert.ok(cb_open, 'should open with 4-backtick fence');

		parser.feed('```\n'); // 3 backticks — doesn't match 4
		const ops2 = parser.take_opcodes();
		// should NOT close — fence count doesn't match
		const has_close = ops2.some((o) => o.type === 'close' && o.id === cb_open.id);
		assert.ok(!has_close, '3-backtick line should not close 4-backtick codeblock');

		parser.finish();
		const ops3 = parser.take_opcodes();
		const has_revert = ops3.some((o) => o.type === 'revert' && o.id === cb_open.id);
		assert.ok(has_revert, 'unclosed codeblock should revert at EOF');

		// verify final tree matches single-pass
		const all_ops = [...ops1, ...ops2, ...ops3];
		const result = mdz_opcodes_to_nodes(all_ops);
		assert.deepEqual(result, mdz_parse('````\n```'));
	});

	test('codeblock closing fence detected with char-by-char feeding', () => {
		const input = '```\ncode\n```\n';
		const parser = new MdzStreamParser();
		for (const char of input) {
			parser.feed(char);
		}
		parser.finish();
		const result = mdz_opcodes_to_nodes(parser.take_opcodes());
		assert.deepEqual(result, mdz_parse(input));
	});

	test('codeblock with lang detected char-by-char', () => {
		const input = '```ts\nconst x = 1;\n```\n';
		const parser = new MdzStreamParser();
		for (const char of input) {
			parser.feed(char);
		}
		parser.finish();
		const result = mdz_opcodes_to_nodes(parser.take_opcodes());
		assert.deepEqual(result, mdz_parse(input));
	});

	test('codeblock followed by content char-by-char', () => {
		const input = '```\nblock\n```\n\n`inline`';
		const parser = new MdzStreamParser();
		for (const char of input) {
			parser.feed(char);
		}
		parser.finish();
		const result = mdz_opcodes_to_nodes(parser.take_opcodes());
		assert.deepEqual(result, mdz_parse(input));
	});

	test('codeblock fence hold does not emit backticks as content', () => {
		const parser = new MdzStreamParser();
		parser.feed('```ts\n');
		parser.take_opcodes(); // open Codeblock
		parser.feed('x');
		const ops1 = parser.take_opcodes();
		// feed closing fence char-by-char
		parser.feed('\n');
		parser.feed('`');
		parser.feed('`');
		parser.feed('`');
		parser.feed('\n');
		const ops2 = parser.take_opcodes();
		// should have a close, not append_text with backticks
		const all_ops = [...ops1, ...ops2];
		const has_close = all_ops.some((o) => o.type === 'close');
		assert.ok(has_close, 'codeblock should be closed');
		const backtick_content = all_ops.filter(
			(o) => (o.type === 'text' || o.type === 'append_text') && o.content.includes('`'),
		);
		assert.equal(
			backtick_content.length,
			0,
			'closing fence backticks should not appear as content',
		);
	});

	// -- Optimistic inline code streaming --

	test('inline code opens optimistically when closer not in buffer', () => {
		const parser = new MdzStreamParser();
		parser.feed('`co');
		const ops = parser.take_opcodes();
		const code_open = ops.find(
			(o): o is MdzOpcodeOpen => o.type === 'open' && o.node_type === 'Code',
		);
		assert.ok(code_open, 'open(Code) should be emitted when buffer ends without closer');
	});

	test('optimistic code closes on matching backtick in next chunk', () => {
		const parser = new MdzStreamParser();
		parser.feed('`co');
		const ops1 = parser.take_opcodes();
		const code_open = ops1.find(
			(o): o is MdzOpcodeOpen => o.type === 'open' && o.node_type === 'Code',
		);
		assert.ok(code_open);

		parser.feed('de`');
		parser.finish();
		const ops2 = parser.take_opcodes();
		const code_close = ops2.find(
			(o): o is MdzOpcodeClose => o.type === 'close' && o.id === code_open.id,
		);
		assert.ok(code_close, 'close(Code) should arrive with closing backtick chunk');

		// verify final tree matches single-pass
		const all_ops = [...ops1, ...ops2];
		const result = mdz_opcodes_to_nodes(all_ops);
		assert.deepEqual(result, mdz_parse('`code`'));
	});

	test('optimistic code reverts on newline', () => {
		const parser = new MdzStreamParser();
		parser.feed('`unclosed');
		const ops1 = parser.take_opcodes();
		const code_open = ops1.find(
			(o): o is MdzOpcodeOpen => o.type === 'open' && o.node_type === 'Code',
		);
		assert.ok(code_open);

		parser.feed('\nmore');
		parser.finish();
		const ops2 = parser.take_opcodes();
		const has_revert = ops2.some(
			(o): o is MdzOpcodeRevert => o.type === 'revert' && o.id === code_open.id,
		);
		assert.ok(has_revert, 'code should revert on newline');

		// verify final tree matches single-pass
		const all_ops = [...ops1, ...ops2];
		const result = mdz_opcodes_to_nodes(all_ops);
		assert.deepEqual(result, mdz_parse('`unclosed\nmore'));
	});

	test('code inside formatting stays buffered (not optimistic)', () => {
		const parser = new MdzStreamParser();
		parser.feed('**bold `co');
		const ops = parser.take_opcodes();
		// should NOT have open(Code) — backtick inside Bold holds
		const code_open = ops.find(
			(o): o is MdzOpcodeOpen => o.type === 'open' && o.node_type === 'Code',
		);
		assert.ok(!code_open, 'backtick inside formatting should not open Code optimistically');
	});

	test('optimistic code content streams via text/append_text', () => {
		const parser = new MdzStreamParser();
		parser.feed('`hel');
		const ops1 = parser.take_opcodes();
		const code_open = ops1.find(
			(o): o is MdzOpcodeOpen => o.type === 'open' && o.node_type === 'Code',
		);
		assert.ok(code_open, 'Code should open before content streams');
		// text opcode should appear after the Code open
		const code_open_idx = ops1.indexOf(code_open);
		const text_idx = ops1.findIndex(
			(o) => (o.type === 'text' || o.type === 'append_text') && o.content.includes('hel'),
		);
		assert.ok(text_idx > code_open_idx, 'code content text should follow open(Code)');

		parser.feed('lo`');
		parser.finish();
		const ops2 = parser.take_opcodes();

		const all_ops = [...ops1, ...ops2];
		const result = mdz_opcodes_to_nodes(all_ops);
		assert.deepEqual(result, mdz_parse('`hello`'));
	});

	test('optimistic code handles single-char chunks', () => {
		const parser = new MdzStreamParser();
		for (const c of '`hello`') {
			parser.feed(c);
		}
		parser.finish();
		const result = mdz_opcodes_to_nodes(parser.take_opcodes());
		assert.deepEqual(result, mdz_parse('`hello`'));
	});

	test('optimistic code reverts at EOF (unclosed)', () => {
		const result = stream_parse('`unclosed');
		assert.deepEqual(result, mdz_parse('`unclosed'));
	});

	test('optimistic code reverts on paragraph break', () => {
		const result = stream_parse('`unclosed\n\nmore');
		assert.deepEqual(result, mdz_parse('`unclosed\n\nmore'));
	});

	test('backtick immediately followed by newline reverts', () => {
		const parser = new MdzStreamParser();
		parser.feed('a`');
		const ops1 = parser.take_opcodes();
		const code_open = ops1.find(
			(o): o is MdzOpcodeOpen => o.type === 'open' && o.node_type === 'Code',
		);
		assert.ok(code_open);

		parser.feed('\nb');
		parser.finish();
		const ops2 = parser.take_opcodes();
		const has_revert = ops2.some(
			(o): o is MdzOpcodeRevert => o.type === 'revert' && o.id === code_open.id,
		);
		assert.ok(has_revert, 'code should revert on immediate newline');

		const all_ops = [...ops1, ...ops2];
		const result = mdz_opcodes_to_nodes(all_ops);
		assert.deepEqual(result, mdz_parse('a`\nb'));
	});

	test('empty optimistic code reverts to literal backticks', () => {
		const parser = new MdzStreamParser();
		parser.feed('a`');
		const ops1 = parser.take_opcodes();
		parser.feed('`b');
		parser.finish();
		const ops2 = parser.take_opcodes();

		const all_ops = [...ops1, ...ops2];
		const result = mdz_opcodes_to_nodes(all_ops);
		assert.deepEqual(result, mdz_parse('a``b'));
	});

	// -- Non-optimistic italic streaming --

	test('italic does not open when closer not in buffer', () => {
		const parser = new MdzStreamParser();
		parser.feed('_ital');
		const ops = parser.take_opcodes();
		const italic_open = ops.find(
			(o): o is MdzOpcodeOpen => o.type === 'open' && o.node_type === 'Italic',
		);
		assert.ok(!italic_open, 'italic should NOT open optimistically when closer not in buffer');
		// _ should be emitted as text
		const text = ops.find(
			(o): o is MdzOpcodeText => o.type === 'text' && o.content.startsWith('_'),
		);
		assert.ok(text, '_ should be emitted as literal text');
	});

	test('italic opens when closer is in same feed', () => {
		const parser = new MdzStreamParser();
		parser.feed('_italic_ rest');
		parser.finish();
		const result = mdz_opcodes_to_nodes(parser.take_opcodes());
		assert.deepEqual(result, mdz_parse('_italic_ rest'));
	});

	test('unclosed italic does not block bold parsing', () => {
		const result = stream_parse('_text **bold**');
		assert.deepEqual(result, mdz_parse('_text **bold**'));
	});

	test('italic at EOF is text', () => {
		const parser = new MdzStreamParser();
		parser.feed('word_');
		parser.finish();
		const result = mdz_opcodes_to_nodes(parser.take_opcodes());
		assert.deepEqual(result, mdz_parse('word_'));
	});

	test('lone underscore at EOF is text', () => {
		const parser = new MdzStreamParser();
		parser.feed('_');
		parser.finish();
		const result = mdz_opcodes_to_nodes(parser.take_opcodes());
		assert.deepEqual(result, mdz_parse('_'));
	});

	test('italic closer arriving in later chunk is not retroactive', () => {
		const parser = new MdzStreamParser();
		parser.feed('hello _world');
		const ops1 = parser.take_opcodes();
		// no italic should be open
		const italic_open = ops1.find(
			(o): o is MdzOpcodeOpen => o.type === 'open' && o.node_type === 'Italic',
		);
		assert.ok(!italic_open, '_ should not open italic when closer not in buffer');

		parser.feed('_ end');
		parser.finish();
		const ops2 = parser.take_opcodes();
		const all_ops = [...ops1, ...ops2];
		const result = mdz_opcodes_to_nodes(all_ops);
		// _ was already emitted as text in first chunk, so no retroactive italic
		const para = result[0]! as {children: Array<{type: string; content?: string}>};
		const has_italic = para.children.some((c) => c.type === 'Italic');
		assert.ok(!has_italic, 'italic should not be created retroactively across chunks');
	});

	// -- Text-first auto-link streaming (wrap opcode) --

	test('URL streams as text then wrap converts to link', () => {
		const parser = new MdzStreamParser();
		parser.feed('see https://fu');
		const ops1 = parser.take_opcodes();
		// text should be visible (not buffered)
		const has_text = ops1.some(
			(o) => (o.type === 'text' || o.type === 'append_text') && o.content.includes('https://'),
		);
		assert.ok(has_text, 'URL text should stream before terminator');

		parser.feed('z.dev rest');
		parser.finish();
		const ops2 = parser.take_opcodes();
		const wrap_op = ops2.find((o): o is MdzOpcodeWrap => o.type === 'wrap');
		assert.ok(wrap_op, 'wrap opcode should be emitted when URL terminates');
		assert.equal(wrap_op.node_type, 'Link');
		assert.equal(wrap_op.reference, 'https://fuz.dev');
		assert.equal(wrap_op.link_type, 'external');

		// verify final tree matches single-pass
		const all_ops = [...ops1, ...ops2];
		const result = mdz_opcodes_to_nodes(all_ops);
		assert.deepEqual(result, mdz_parse('see https://fuz.dev rest'));
	});

	test('URL with trailing punctuation trims correctly', () => {
		const result = stream_parse('visit https://fuz.dev.');
		assert.deepEqual(result, mdz_parse('visit https://fuz.dev.'));
	});

	test('URL with multiple trailing punctuation chars', () => {
		const result = stream_parse('see https://fuz.dev...');
		assert.deepEqual(result, mdz_parse('see https://fuz.dev...'));
	});

	test('bare protocol with no content is not a link', () => {
		const result = stream_parse('see https:// ok');
		assert.deepEqual(result, mdz_parse('see https:// ok'));
	});

	test('URL with preceding text and trailing punctuation', () => {
		const result = stream_parse('visit https://fuz.dev, ok');
		assert.deepEqual(result, mdz_parse('visit https://fuz.dev, ok'));
	});

	test('http:// URL detected and wrapped', () => {
		const result = stream_parse('see http://fuz.dev ok');
		assert.deepEqual(result, mdz_parse('see http://fuz.dev ok'));
	});

	test('partial URL prefix streams as text then confirms', () => {
		const parser = new MdzStreamParser();
		parser.feed('see ');
		parser.feed('htt');
		const ops1 = parser.take_opcodes();
		// 'htt' should stream as visible text (speculative prefix, not held)
		const has_htt = ops1.some(
			(o) => (o.type === 'text' || o.type === 'append_text') && o.content.includes('htt'),
		);
		assert.ok(has_htt, 'partial URL prefix should stream as text immediately');

		parser.feed('ps://fuz.dev ok');
		parser.finish();
		const ops2 = parser.take_opcodes();
		const all_ops = [...ops1, ...ops2];
		const result = mdz_opcodes_to_nodes(all_ops);
		assert.deepEqual(result, mdz_parse('see https://fuz.dev ok'));
	});

	test('non-URL h-word is not held beyond one char', () => {
		const parser = new MdzStreamParser();
		parser.feed('see ');
		parser.feed('he');
		const ops = parser.take_opcodes();
		// 'he' doesn't match 'ht...' — should be consumed as text
		const has_he = ops.some(
			(o) => (o.type === 'text' || o.type === 'append_text') && o.content.includes('he'),
		);
		assert.ok(has_he, 'non-matching prefix should be consumed as text immediately');
	});

	test('URL after word char is not detected (no word boundary)', () => {
		const result = stream_parse('xhttps://fuz.dev');
		assert.deepEqual(result, mdz_parse('xhttps://fuz.dev'));
		assert.equal(result.length, 1);
		assert.equal(result[0]!.type, 'Paragraph');
		const para = result[0]! as {children: Array<{type: string; content?: string}>};
		assert.equal(para.children.length, 1);
		assert.equal(para.children[0]!.type, 'Text');
		assert.equal(para.children[0]!.content, 'xhttps://fuz.dev');
	});

	test('URL after digit is not detected (no word boundary)', () => {
		const result = stream_parse('1https://fuz.dev');
		assert.deepEqual(result, mdz_parse('1https://fuz.dev'));
		const para = result[0]! as {children: Array<{type: string; content?: string}>};
		assert.equal(para.children.length, 1);
		assert.equal(para.children[0]!.type, 'Text');
	});

	test('URL after punctuation is detected (word boundary)', () => {
		const result = stream_parse('(https://fuz.dev)');
		assert.deepEqual(result, mdz_parse('(https://fuz.dev)'));
	});

	test('URL after quote is detected (word boundary)', () => {
		const result = stream_parse('"https://fuz.dev"');
		assert.deepEqual(result, mdz_parse('"https://fuz.dev"'));
	});

	test('URL with balanced parens in path preserves them', () => {
		const result = stream_parse('see https://en.wikipedia.org/wiki/Foo_(bar) ok');
		assert.deepEqual(result, mdz_parse('see https://en.wikipedia.org/wiki/Foo_(bar) ok'));
	});

	test('speculation cancels then URL detected on retry', () => {
		const result = stream_parse('hhttps://fuz.dev https://fuz.dev');
		const para = result[0]! as {
			children: Array<{type: string; content?: string; reference?: string}>;
		};
		// first h starts speculation, second h fails it, so hhttps://fuz.dev is text
		// then space, then URL is detected
		assert.equal(para.children[0]!.type, 'Text');
		assert.ok(para.children[0]!.content!.startsWith('hhttps://'));
		const link = para.children.find((c) => c.type === 'Link');
		assert.ok(link, 'second URL should be detected after failed speculation');
		assert.equal(link.reference, 'https://fuz.dev');
	});

	test('path auto-link streams then wraps with internal link_type', () => {
		const parser = new MdzStreamParser();
		parser.feed('see /docs/');
		const ops1 = parser.take_opcodes();
		parser.feed('api rest');
		parser.finish();
		const ops2 = parser.take_opcodes();

		const wrap_op = [...ops1, ...ops2].find((o): o is MdzOpcodeWrap => o.type === 'wrap');
		assert.ok(wrap_op);
		assert.equal(wrap_op.link_type, 'internal');
		assert.equal(wrap_op.reference, '/docs/api');

		const all_ops = [...ops1, ...ops2];
		const result = mdz_opcodes_to_nodes(all_ops);
		assert.deepEqual(result, mdz_parse('see /docs/api rest'));
	});

	test('relative path auto-link wraps correctly', () => {
		const result = stream_parse('see ./README.md ok');
		assert.deepEqual(result, mdz_parse('see ./README.md ok'));
	});

	test('URL at EOF wraps correctly', () => {
		const result = stream_parse('see https://fuz.dev');
		assert.deepEqual(result, mdz_parse('see https://fuz.dev'));
	});

	test('URL inside bold wraps correctly', () => {
		const result = stream_parse('**see https://fuz.dev end**');
		assert.deepEqual(result, mdz_parse('**see https://fuz.dev end**'));
	});

	test('URL streams correctly across multiple chunks', () => {
		const parser = new MdzStreamParser();
		parser.feed('see https://f');
		parser.feed('uz');
		parser.feed('.dev');
		parser.feed(' rest');
		parser.finish();
		const result = mdz_opcodes_to_nodes(parser.take_opcodes());
		assert.deepEqual(result, mdz_parse('see https://fuz.dev rest'));
	});

	test('URL detected correctly with single-char feeds', () => {
		const parser = new MdzStreamParser();
		for (const c of 'see https://fuz.dev rest') {
			parser.feed(c);
		}
		parser.finish();
		const result = mdz_opcodes_to_nodes(parser.take_opcodes());
		assert.deepEqual(result, mdz_parse('see https://fuz.dev rest'));
	});

	test('path detected correctly with single-char feeds', () => {
		const parser = new MdzStreamParser();
		for (const c of 'see /docs/api rest') {
			parser.feed(c);
		}
		parser.finish();
		const result = mdz_opcodes_to_nodes(parser.take_opcodes());
		assert.deepEqual(result, mdz_parse('see /docs/api rest'));
	});

	test('consecutive URLs separated by space', () => {
		const result = stream_parse('https://a.com https://b.com');
		assert.deepEqual(result, mdz_parse('https://a.com https://b.com'));
	});
});

// -- Fixture-based tests --

let fixtures: Array<MdzFixture> = [];

beforeAll(async () => {
	fixtures = await load_fixtures();
});

describe('MdzStreamParser fixture comparison', () => {
	test('all fixtures match (one-shot feed)', () => {
		for (const fixture of fixtures) {
			const stream_result = stream_parse(fixture.input);
			assert.deepEqual(stream_result, fixture.expected, `Fixture "${fixture.name}"`);
		}
	});

	// Char-by-char streaming matches one-shot for 209/270 fixtures. The 61 that
	// don't are listed here explicitly — each requires buffer context that a
	// single-char feed can't provide:
	// - Italic (`_..._`) is non-optimistic and needs the closer in the buffer
	//   (documented divergence — see `mdz_stream_parser.ts`).
	// - Strikethrough (`~...~`) word-boundary check needs the closer in the buffer.
	// - Tags (`<Tag>`/`</Tag>`) need the tag name visible to commit.
	// - A few mixed-delimiter or nested-formatting fixtures hit edge cases at
	//   single-char chunking that are out of scope for streaming.
	//
	// Replacing this denylist with a regex heuristic would either be too broad
	// (excluding fixtures that DO survive char-by-char — 92 false negatives in
	// the prior version) or too lax (allowing regressions to slip through).
	// Keep this list precise and update when the parser changes.
	const char_by_char_denylist = new Set([
		'adjacent_empty_bold',
		'adjacent_multiple_sequence',
		'adjacent_with_numbers',
		'adjacent_with_preceding_underscore',
		'adjacent_with_trailing_text',
		'all_three_nested_reverse_close',
		'bold_italic_intraword_underscore',
		'bold_nested_italic',
		'bold_strikethrough_italic_adjacent_edge_case',
		'bold_unclosed_with_italic',
		'bold_with_failed_strikethrough',
		'cascading_delimiter_failures',
		'component_adjacent_bold',
		'component_at_end',
		'component_at_start',
		'component_between_paragraphs',
		'component_breaks_inline',
		'component_empty',
		'component_inline',
		'component_multiline',
		'component_multiple',
		'component_nested',
		'component_self_closing',
		'component_simple',
		'component_space_before_closing',
		'component_with_formatting',
		'delimiter_with_punctuation',
		'element_div',
		'element_empty',
		'element_multiline',
		'element_span',
		'formatting_adjacent',
		'formatting_all_combined',
		'formatting_alternating_adjacent',
		'formatting_deeply_nested',
		'formatting_single_char',
		'formatting_stray_closers',
		'formatting_triple_adjacent',
		'heading_with_inline',
		'heading_with_tag',
		'intraword_tilde_leading',
		'intraword_underscore_adjacent_valid',
		'intraword_underscore_both_ends',
		'intraword_underscore_leading',
		'intraword_underscore_mixed',
		'italic_adjacent_bold',
		'italic_adjacent_strikethrough',
		'italic_interrupts_bold',
		'italic_multiline',
		'italic_nested_bold_underscore',
		'italic_nested_code_underscore',
		'italic_nested_link',
		'italic_simple_underscore',
		'italic_with_space_before_closing',
		'italic_with_space_before_closing_after_bold',
		'italic_with_unclosed_bold',
		'italic_with_unclosed_strikethrough',
		'link_markdown_text_all_formatting',
		'max_search_index_boundary',
		'mixed_formatting_basic',
		'mixed_formatting_with_strikethrough',
		'paragraph_break_triple_newline',
		'paragraph_empty_between',
		'paragraph_only_formatting',
		'strikethrough_adjacent_italic',
		'strikethrough_nested_italic',
		'strikethrough_with_failed_italic',
	]);
	const is_char_by_char_safe = (name: string): boolean => !char_by_char_denylist.has(name);

	// -- Trailing newline trimming across take_opcodes() boundaries --
	// The \n hold mechanism keeps a trailing \n in the buffer rather than flushing
	// it to an opcode. These tests verify that paragraph content never has a spurious
	// trailing \n regardless of chunk boundaries, and that positions are correct.

	test('trailing newline trimmed: paragraph break split across chunks', () => {
		const parser = new MdzStreamParser();
		parser.feed('hello\n');
		const ops1 = parser.take_opcodes();
		parser.feed('\nworld');
		parser.finish();
		const ops2 = parser.take_opcodes();
		const all_ops = [...ops1, ...ops2];
		const nodes = mdz_opcodes_to_nodes(all_ops);
		assert.deepEqual(nodes, mdz_parse('hello\n\nworld'));
	});

	// Regression: handle_paragraph_break previously ate consecutive newlines only
	// within the current buffer. A run of 3+ newlines split across chunks could
	// leak a leading `\n` into the next paragraph's text. The fix mirrors the
	// heading-newline absorb path: set skip_leading_newlines=true when the absorb
	// runs out of buffer.
	test('paragraph break: multi-newline run absorbed across chunks', () => {
		// Vary newline-run length to lock in the absorb boundary for 3+ newlines
		// (the buggy case was anything that could split mid-run across chunks).
		const newline_counts = [3, 4, 5];
		const chunk_sizes = [2, 3, 5, 7, 14];
		for (const n of newline_counts) {
			const input = `paragraph 1${'\n'.repeat(n)}paragraph 2\n`;
			const expected = mdz_parse(input);
			for (const chunk_size of chunk_sizes) {
				const parser = new MdzStreamParser();
				for (let i = 0; i < input.length; i += chunk_size) {
					parser.feed(input.slice(i, i + chunk_size));
				}
				parser.finish();
				assert.deepEqual(
					mdz_opcodes_to_nodes(parser.take_opcodes()),
					expected,
					`newlines=${n} chunk_size=${chunk_size}`,
				);
			}
		}
	});

	test('trailing newline trimmed: HR split across chunks', () => {
		const parser = new MdzStreamParser();
		parser.feed('hello\n');
		const ops1 = parser.take_opcodes();
		parser.feed('---\n');
		parser.finish();
		const ops2 = parser.take_opcodes();
		const all_ops = [...ops1, ...ops2];
		const nodes = mdz_opcodes_to_nodes(all_ops);
		assert.deepEqual(nodes, mdz_parse('hello\n---\n'));
	});

	test('trailing newline trimmed: heading split across chunks', () => {
		const parser = new MdzStreamParser();
		parser.feed('hello\n');
		const ops1 = parser.take_opcodes();
		parser.feed('\n# heading');
		parser.finish();
		const ops2 = parser.take_opcodes();
		const all_ops = [...ops1, ...ops2];
		const nodes = mdz_opcodes_to_nodes(all_ops);
		assert.deepEqual(nodes, mdz_parse('hello\n\n# heading'));
	});

	test('trailing newline trimmed: multi-line paragraph break split', () => {
		const parser = new MdzStreamParser();
		parser.feed('hello\nb\n');
		const ops1 = parser.take_opcodes();
		parser.feed('\nworld');
		parser.finish();
		const ops2 = parser.take_opcodes();
		const all_ops = [...ops1, ...ops2];
		const nodes = mdz_opcodes_to_nodes(all_ops);
		assert.deepEqual(nodes, mdz_parse('hello\nb\n\nworld'));
	});

	test('trailing newline trimmed: three chunks with mid-stream drain', () => {
		const parser = new MdzStreamParser();
		parser.feed('aaa\n');
		const ops1 = parser.take_opcodes();
		parser.feed('bbb\n');
		const ops2 = parser.take_opcodes();
		parser.feed('\nccc');
		parser.finish();
		const ops3 = parser.take_opcodes();
		const all_ops = [...ops1, ...ops2, ...ops3];
		const nodes = mdz_opcodes_to_nodes(all_ops);
		assert.deepEqual(nodes, mdz_parse('aaa\nbbb\n\nccc'));
	});

	// Targeted regression for the post-drain trim path: the paragraph text is
	// emitted and drained in chunk 1, then the single '\n' that joins it to the
	// codeblock fence is accumulated and flushed as an `append_text` in chunk 2.
	// `close_paragraph` must trim the trailing '\n' from the previously-drained
	// text by id (via `last_text_*` tracking on state), not by scanning
	// `state.opcodes` — that array was emptied by `take_opcodes()`.
	test('trim_text targets drained text id when paragraph closes after drain', () => {
		const parser = new MdzStreamParser();
		parser.feed('Some text.\n');
		const ops1 = parser.take_opcodes();
		parser.feed('```\ncode\n```\n');
		parser.finish();
		const ops2 = parser.take_opcodes();
		const text_op = ops1.find((o): o is MdzOpcodeText => o.type === 'text');
		assert.ok(text_op);
		assert.equal(text_op.content, 'Some text.');
		const trim_op = ops2.find((o) => o.type === 'trim_text');
		assert.ok(trim_op, 'trim_text must fire on the drained text id');
		assert.equal(trim_op.id, text_op.id, 'trim_text id must match the drained text');
		const result = mdz_opcodes_to_nodes([...ops1, ...ops2]);
		assert.deepEqual(result, mdz_parse('Some text.\n```\ncode\n```\n'));
	});

	/**
	 * Run every safe fixture through `feed_fn`, then deep-equal the resulting
	 * tree against the fixture's expected output. Accumulates failures across
	 * all fixtures so a stale denylist surfaces with the full set in one run
	 * (no iterative trial-and-error).
	 */
	const assert_safe_fixtures = (
		label: string,
		feed_fn: (parser: MdzStreamParser, input: string) => Array<MdzOpcode>,
	): void => {
		const safe_fixtures = fixtures.filter((f) => is_char_by_char_safe(f.name));
		// sanity: with 270 fixtures and ~65 known-unsafe, we expect ~200 safe.
		// If this number drops sharply the denylist is probably out of date.
		assert.ok(
			safe_fixtures.length >= 200,
			`Expected ≥200 char-by-char safe fixtures, got ${safe_fixtures.length} — denylist may be stale`,
		);

		const failures: Array<string> = [];
		for (const fixture of safe_fixtures) {
			const parser = new MdzStreamParser();
			const ops = feed_fn(parser, fixture.input);
			try {
				assert.deepEqual(mdz_opcodes_to_nodes(ops), fixture.expected);
			} catch {
				failures.push(fixture.name);
			}
		}
		if (failures.length > 0) {
			throw new Error(
				`${label}: ${failures.length} safe fixture(s) failed — add to denylist:\n` +
					failures.map((n) => `\t'${n}',`).join('\n'),
			);
		}
	};

	test('char-by-char safe fixtures match one-shot', () => {
		assert_safe_fixtures('Char-by-char', (parser, input) => {
			for (const ch of input) parser.feed(ch);
			parser.finish();
			return parser.take_opcodes();
		});
	});

	// LCG: numerical recipes constants — deterministic and seedable.
	const make_chunker = (seed: number): (() => number) => {
		let s = seed >>> 0;
		return () => {
			s = (s * 1664525 + 1013904223) >>> 0;
			// chunk sizes 2..16 inclusive
			return 2 + (s % 15);
		};
	};

	// Exercises chunk boundaries between the two extremes (one-shot and char-by-char).
	// Many streaming bugs hide at 2- to 16-byte boundaries — past the buffer-context
	// thresholds that defeat char-by-char but inside the lookahead horizons.
	test('safe fixtures match one-shot under varied chunk sizes', () => {
		const next_size = make_chunker(0xc0ffee);
		assert_safe_fixtures('Varied chunks', (parser, input) => {
			let i = 0;
			while (i < input.length) {
				const size = Math.min(next_size(), input.length - i);
				parser.feed(input.slice(i, i + size));
				i += size;
			}
			parser.finish();
			return parser.take_opcodes();
		});
	});

	// Exercises `take_opcodes()` boundaries — opcodes are drained mid-stream and
	// concatenated, which must produce the same tree as a single drain at finish.
	test('safe fixtures match one-shot with mid-stream take_opcodes drains', () => {
		const next_size = make_chunker(0xbadf00d);
		assert_safe_fixtures('Drained', (parser, input) => {
			const drained: Array<MdzOpcode> = [];
			let i = 0;
			let parity = 0;
			while (i < input.length) {
				const size = Math.min(next_size(), input.length - i);
				parser.feed(input.slice(i, i + size));
				// drain ~half the time (deterministic — toggle on each chunk)
				if ((parity++ & 1) === 0) drained.push(...parser.take_opcodes());
				i += size;
			}
			parser.finish();
			drained.push(...parser.take_opcodes());
			return drained;
		});
	});
});
