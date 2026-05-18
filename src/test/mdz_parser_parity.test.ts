/**
 * Parity tests: streaming parser path (`MdzStreamParser` + `mdz_opcodes_to_nodes`)
 * must produce the same `MdzNode[]` tree as the one-shot `mdz_parse`.
 *
 * `mdz_parse` is the canonical reference; divergences are bugs unless explicitly
 * documented in both parsers' doc comments and asserted via `deliberate-divergence`.
 */

import {test, assert, describe, beforeAll} from 'vitest';

import {mdz_parse, type MdzNode} from '$lib/mdz.js';
import {MdzStreamParser} from '$lib/mdz_stream_parser.js';
import {mdz_opcodes_to_nodes} from '$lib/mdz_opcodes_to_nodes.js';
import {MdzStreamState, type MdzStreamNode} from '$lib/mdz_stream_state.svelte.js';
import {load_fixtures, type MdzFixture} from './fixtures/mdz/mdz_test_helpers.js';

const stream_parse_text = (text: string) => {
	const p = new MdzStreamParser();
	p.feed(text);
	p.finish();
	return mdz_opcodes_to_nodes(p.take_opcodes());
};

const stream_parse_chunked = (text: string, chunk_size: number) => {
	const p = new MdzStreamParser();
	for (let i = 0; i < text.length; i += chunk_size) {
		p.feed(text.slice(i, i + chunk_size));
	}
	p.finish();
	return mdz_opcodes_to_nodes(p.take_opcodes());
};

/**
 * Render via `MdzStreamState`, then walk the reactive tree and reproduce a
 * plain-object shape compatible with `MdzNode[]`. This lets us assert that
 * the two consumers (`mdz_opcodes_to_nodes` and `MdzStreamState`) build the
 * same structure from the same opcodes — modulo per-node fields that
 * `MdzStreamState` doesn't track (`start`, `end`, `heading_id`).
 */
const stream_state_render = (input: string): Array<unknown> => {
	const parser = new MdzStreamParser();
	parser.feed(input);
	parser.finish();
	const state = new MdzStreamState();
	state.apply_batch(parser.take_opcodes());
	return state.root.map(to_plain);
};

// node types that carry text via `content` rather than a `children` array
const LEAF_TYPES = new Set(['Text', 'Code', 'Codeblock', 'Hr']);

interface PlainNode {
	type: string;
	content?: string;
	children?: Array<PlainNode>;
	level?: number;
	name?: string;
	lang?: string | null;
	reference?: string;
	link_type?: string;
}

const merge_adjacent_text = (nodes: Array<PlainNode>): Array<PlainNode> => {
	const out: Array<PlainNode> = [];
	for (const c of nodes) {
		const last = out[out.length - 1];
		if (c.type === 'Text' && last?.type === 'Text') {
			last.content = (last.content ?? '') + (c.content ?? '');
		} else {
			out.push(c);
		}
	}
	return out;
};

/**
 * Apply the same tidies `mdz_opcodes_to_nodes` does in `build_node`:
 * - merge adjacent Text children inside every container (Paragraph, Heading,
 *   Bold, Italic, Strikethrough, Link, Element, Component)
 * - unwrap a Paragraph whose only meaningful child is a single
 *   Component/Element (MDX convention)
 */
const tidy = (nodes: Array<PlainNode>): Array<PlainNode> => {
	const out: Array<PlainNode> = [];
	for (const n of nodes) {
		const tidied: PlainNode = {...n};
		if (n.children) {
			tidied.children = merge_adjacent_text(tidy(n.children));
		}
		if (tidied.type === 'Paragraph' && tidied.children) {
			let single: PlainNode | null = null;
			let bail = false;
			for (const c of tidied.children) {
				if (c.type === 'Component' || c.type === 'Element') {
					if (single) {
						bail = true;
						break;
					}
					single = c;
				} else if (c.type === 'Text') {
					if ((c.content ?? '').trim() !== '') {
						bail = true;
						break;
					}
				} else {
					bail = true;
					break;
				}
			}
			if (!bail && single) {
				out.push(single);
				continue;
			}
		}
		out.push(tidied);
	}
	return out;
};

const to_plain = (node: MdzStreamNode): unknown => {
	const base: Record<string, unknown> = {type: node.type};
	if (node.type === 'Text' || node.type === 'Code' || node.type === 'Codeblock') {
		base.content = node.content;
	}
	if (!LEAF_TYPES.has(node.type)) {
		base.children = node.children.map(to_plain);
	}
	if (node.level !== undefined) base.level = node.level;
	if (node.name !== undefined) base.name = node.name;
	if (node.lang !== undefined) base.lang = node.lang;
	if (node.reference !== undefined) base.reference = node.reference;
	if (node.link_type !== undefined) base.link_type = node.link_type;
	return base;
};

/** Project an `MdzNode` to the same plain shape (drop `start`/`end`/`heading_id`). */
const project_mdz_node = (node: MdzNode): unknown => {
	const base: Record<string, unknown> = {type: node.type};
	if (node.type === 'Text' || node.type === 'Code' || node.type === 'Codeblock') {
		base.content = node.content;
	}
	if (!LEAF_TYPES.has(node.type) && 'children' in node) {
		base.children = node.children.map(project_mdz_node);
	}
	if ('level' in node) base.level = node.level;
	if ('name' in node) base.name = node.name;
	if ('lang' in node) base.lang = node.lang;
	if ('reference' in node) base.reference = node.reference;
	if ('link_type' in node) base.link_type = node.link_type;
	return base;
};

describe('mdz parser parity', () => {
	describe('leading whitespace', () => {
		for (const input of ['\nhello', '\n\nhello', '\n\n\nhello', 'hello', 'hello\n', 'hello\n\n']) {
			test(`one-shot matches mdz_parse for ${JSON.stringify(input)}`, () => {
				assert.deepEqual(stream_parse_text(input), mdz_parse(input));
			});
		}
	});

	describe('intraword URL', () => {
		for (const input of [
			'xhttps://example.com',
			'1https://example.com',
			'.https://example.com',
			'(https://example.com)',
			'"https://example.com"',
			'see https://example.com',
			'\nhttps://example.com',
			'https://example.com',
		]) {
			test(`one-shot matches mdz_parse for ${JSON.stringify(input)}`, () => {
				assert.deepEqual(stream_parse_text(input), mdz_parse(input));
			});
		}
	});

	describe('intraword path', () => {
		for (const input of [
			'x/path/to/thing',
			'x./relative',
			' /path/to/thing',
			' ./relative',
			'/path/to/thing',
			'./relative',
			'(./relative)',
		]) {
			test(`one-shot matches mdz_parse for ${JSON.stringify(input)}`, () => {
				assert.deepEqual(stream_parse_text(input), mdz_parse(input));
			});
		}
	});

	describe('unclosed at EOF', () => {
		for (const input of [
			'**unclosed',
			'_unclosed',
			'~unclosed',
			'`unclosed',
			'[unclosed](',
			'[unclosed]',
			'<Alert>unclosed',
			'```ts\nunclosed',
			'**bold _italic',
			'**bold `code',
		]) {
			test(`one-shot matches mdz_parse for ${JSON.stringify(input)}`, () => {
				assert.deepEqual(stream_parse_text(input), mdz_parse(input));
			});
		}
	});

	describe('mixed edge cases', () => {
		for (const input of [
			'',
			'\n',
			'\n\n',
			' ',
			'   \n   ',
			'  hello',
			'hello  \n',
			// space before block
			' # not a heading',
			'\n# heading',
			// boundary slipups
			'word*not_emph*word',
			'a\nhttps://example.com',
			'a https://example.com b',
		]) {
			test(`one-shot matches mdz_parse for ${JSON.stringify(input)}`, () => {
				assert.deepEqual(stream_parse_text(input), mdz_parse(input));
			});
		}
	});

	describe('fixtures one-shot', () => {
		let fixtures: Array<MdzFixture> = [];
		beforeAll(async () => {
			fixtures = await load_fixtures();
		});

		test('every fixture parses identically', () => {
			let diff_count = 0;
			const diffs: Array<string> = [];
			for (const fx of fixtures) {
				const a = mdz_parse(fx.input);
				const b = stream_parse_text(fx.input);
				try {
					assert.deepEqual(b, a);
				} catch {
					diff_count++;
					if (diffs.length < 5) {
						diffs.push(
							`${fx.name}: input=${JSON.stringify(fx.input)}\nstream=${JSON.stringify(b)}\nmdz_parse=${JSON.stringify(a)}`,
						);
					}
				}
			}
			if (diff_count > 0) {
				throw new Error(
					`${diff_count} fixture(s) diverge between mdz_parse and streaming parser:\n${diffs.join('\n')}`,
				);
			}
		});
	});

	describe('chunked input parity', () => {
		// inputs whose chunked tree must match the one-shot tree
		const inputs = [
			'hello',
			'\nhello',
			'see https://example.com here',
			'`code`',
			'a\n\nb',
			'# Heading\n\ntext',
			'```ts\ncode\n```',
			'[text](https://example.com)',
		];
		for (const input of inputs) {
			for (const chunk_size of [1, 2, 3]) {
				test(`chunk_size=${chunk_size} matches one-shot for ${JSON.stringify(input)}`, () => {
					assert.deepEqual(stream_parse_chunked(input, chunk_size), stream_parse_text(input));
				});
			}
		}
	});

	describe('MdzStreamState parity', () => {
		// path 2 (mdz_opcodes_to_nodes) tidies its output: adjacent text nodes
		// merge, and a paragraph whose only meaningful child is a single
		// Component/Element is unwrapped (MDX convention). Path 3
		// (MdzStreamState) builds a live reactive tree from the same opcodes
		// and does NOT apply those tidies — it keeps per-id node identity so
		// Svelte can update granularly. So full deep-equal is too strict.
		//
		// For inputs that have neither adjacent text runs nor single-tag
		// paragraphs, the two trees should match exactly (after normalizing
		// `start`/`end`/`heading_id`).
		const strict_inputs = [
			'hello',
			'\nhello',
			'\n\nhello',
			' ',
			'   \n   ',
			'**bold** done',
			'xhttps://example.com',
			'# Heading\n\nbody',
			'---\nafter',
			'```ts\ncode\n```',
			'a\n\nb',
			'`code`',
		];
		for (const input of strict_inputs) {
			test(`tree matches for ${JSON.stringify(input)}`, () => {
				const path2 = mdz_parse(input).map(project_mdz_node);
				const path3 = stream_state_render(input);
				assert.deepEqual(path3, path2);
			});
		}

		// For inputs where path 2 tidies (text-merge or single-tag unwrap),
		// apply the same tidy to path 3's output and assert structural equality.
		// Stronger than mere rendered-text equivalence.
		const tidy_inputs = [
			'see https://example.com here',
			'a https://x.io b',
			'<Alert>hi</Alert>',
			'<div>x</div>',
			'**a** **b**',
			'see /docs here',
			'a **b** c **d** e',
		];
		for (const input of tidy_inputs) {
			test(`tidied tree matches for ${JSON.stringify(input)}`, () => {
				const path2 = mdz_parse(input).map(project_mdz_node) as Array<PlainNode>;
				const path3 = stream_state_render(input) as Array<PlainNode>;
				assert.deepEqual(tidy(path3), path2);
			});
		}

		// Run every fixture through path 3 (MdzStreamState), tidy, and compare
		// to path 2 (mdz_opcodes_to_nodes / mdz_parse). This is the strongest
		// per-consumer parity assertion in the suite.
		let fixtures: Array<MdzFixture> = [];
		beforeAll(async () => {
			fixtures = await load_fixtures();
		});

		test('every fixture round-trips through MdzStreamState', () => {
			const failures: Array<{name: string; diff: string}> = [];
			for (const fx of fixtures) {
				const path2 = mdz_parse(fx.input).map(project_mdz_node) as Array<PlainNode>;
				const path3 = stream_state_render(fx.input) as Array<PlainNode>;
				try {
					assert.deepEqual(tidy(path3), path2);
				} catch {
					failures.push({
						name: fx.name,
						diff: `input=${JSON.stringify(fx.input)}\npath3(tidied)=${JSON.stringify(tidy(path3))}\npath2=${JSON.stringify(path2)}`,
					});
				}
			}
			if (failures.length > 0) {
				throw new Error(
					`${failures.length} fixture(s) diverge between path 2 and path 3 (after tidy):\n` +
						failures
							.slice(0, 3)
							.map((f) => `--- ${f.name} ---\n${f.diff}`)
							.join('\n\n'),
				);
			}
		});
	});

	describe('deliberate divergences', () => {
		// Italic (`_..._`) is non-optimistic: the opening `_` is emitted as text
		// when no closer is visible in the current buffer. This makes italic
		// chunk-boundary-sensitive — when the closer arrives in a later chunk
		// the italic doesn't form. Documented in `mdz_stream_parser.ts` and
		// `mdz_stream_parser_inline.ts`. Asserting the gap here keeps it from
		// being mistaken for a regression.
		test('italic does not span chunk boundary', () => {
			const chunked = stream_parse_chunked('**bold** _italic_', 1);
			const para = chunked[0]!;
			assert.equal(para.type, 'Paragraph');
			if (para.type !== 'Paragraph') return;
			const has_italic = para.children.some((c) => c.type === 'Italic');
			assert.ok(!has_italic, 'italic should NOT form when `_..._` straddles a chunk boundary');
			// one-shot, by contrast, does form italic
			const one_shot = stream_parse_text('**bold** _italic_');
			const one_para = one_shot[0]! as {children: Array<{type: string}>};
			assert.ok(
				one_para.children.some((c) => c.type === 'Italic'),
				'one-shot should still form italic',
			);
		});
	});

	describe('chunked vs mdz_parse', () => {
		const inputs = ['\nhello', 'xhttps://example.com', 'see https://example.com\n', '**bold**\n'];
		for (const input of inputs) {
			for (const chunk_size of [1, 2, 3]) {
				test(`chunk_size=${chunk_size} matches mdz_parse for ${JSON.stringify(input)}`, () => {
					assert.deepEqual(stream_parse_chunked(input, chunk_size), mdz_parse(input));
				});
			}
		}
	});
});
