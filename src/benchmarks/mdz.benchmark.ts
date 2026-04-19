/**
 * mdz parser benchmarks with baseline comparison.
 *
 * Usage:
 *   gro run src/benchmarks/mdz.benchmark.ts          # run and compare against baseline
 *   gro run src/benchmarks/mdz.benchmark.ts --save   # run and save as new baseline
 */

import {readFile, writeFile} from 'node:fs/promises';
import {Benchmark} from '@fuzdev/fuz_util/benchmark.js';
import {
	benchmark_baseline_save,
	benchmark_baseline_compare,
	benchmark_baseline_format,
} from '@fuzdev/fuz_util/benchmark_baseline.js';
import {format_file} from '@fuzdev/gro/format_file.js';

import {mdz_parse} from '../lib/mdz.js';
import {mdz_parse_lexer} from '../lib/mdz_token_parser.js';
import {MdzStreamParser} from '../lib/mdz_stream_parser.js';
import {mdz_opcodes_to_nodes} from '../lib/mdz_opcodes_to_nodes.js';

/* eslint-disable no-console */

const save_baseline = process.argv.includes('--save');
const BASELINE_PATH = 'src/benchmarks';
const BASELINE_FILE = `${BASELINE_PATH}/baseline.json`;

// -- Benchmark inputs --

// Generate a large synthetic input
const generate_large_input = (): string => {
	const sections: Array<string> = [];
	for (let i = 0; i < 50; i++) {
		sections.push(`## Section ${i + 1}

This is paragraph ${i + 1} with **bold** and _italic_ text.
Here's a \`code snippet\` and a [link](https://example.com/${i}).

\`\`\`
code block ${i + 1}
const value = ${i};
\`\`\`

Some more text with https://auto.link/${i} and ~strikethrough~ content.`);
	}
	return `# Large Document\n\n${sections.join('\n\n')}`;
};

const inputs = [
	{name: 'tiny', content: 'hello **bold** world'},
	{
		name: 'small',
		content: `# Small Document

This is a _simple_ paragraph with **bold** text and \`inline code\`.

Here's a link: [click here](https://example.com) and an auto-link https://example.com/path.

Some ~strikethrough~ text and more _italic_ words.`,
	},
	{
		name: 'medium',
		content: `# Medium Document

## Introduction

This is a **medium-sized** document that tests various mdz features.
It has multiple paragraphs with _italic_, **bold**, and \`code\` formatting.

## Code Examples

Here's some inline \`code\` and a code block:

\`\`\`typescript
const x = 42;
function hello() {
  return 'world';
}
\`\`\`

## Links and References

Visit [the docs](https://docs.example.com) for more info.
Also see https://example.com/api and /internal/path for details.

## Formatting

This paragraph has **bold with _nested italic_** and standalone ~strikethrough~ text.
Multiple **bold** words in a **single** line with \`code\` mixed in.

---

Final section after a horizontal rule.

More content with [multiple](https://a.com) links [here](https://b.com) and [there](/c).`,
	},
	{name: 'large', content: generate_large_input()},
	{
		name: 'angle brackets',
		// Angle brackets without closing tags — exercises tag bail-out paths.
		// Before the pre-check fix, unclosed tags like <GodType> caused O(n*k)
		// scanning through the rest of the document.
		content: `# TypeScript-Heavy Document

### Why object literals beat Pick<GodType>

A \`Pick<AppRuntime, 'env_get'>\` pattern forces every consumer to import the
god type. Small standalone interfaces have no such coupling.

## Generic Signatures

\`\`\`typescript
export interface GitDeps {
  checkout: (options: {branch: string}) => Promise<Result<object, {message: string}>>;
  push: (options: {cwd?: string}) => Promise<Result<object, {message: string}>>;
}

export const update = async (
  repos: Array<LocalRepo>,
  updates: Map<string, string>,
): Promise<void> => {};

export const read_json = <T>(path: string): Promise<T | null> => {};
\`\`\`

### Narrowing with \`Pick<>\`

\`Pick<>\` on small \`*Deps\` interfaces is fine:

\`\`\`typescript
password: Pick<PasswordHashDeps, 'hash_password'>;
\`\`\`

The anti-pattern is \`Pick<GodType>\` — coupling every consumer to a large type.

## More Generics

Functions with Array<string>, Promise<void>, and Map<string, number> in prose.

| Type | Example |
| --- | --- |
| \`Array<string>\` | list of names |
| \`Promise<Result<object>>\` | async result |
| \`Pick<Deps, 'key'>\` | narrowed deps |`,
	},
	{
		name: 'many angles',
		// Many unclosed angle brackets in a single paragraph — worst case for
		// repeated tag bail-outs within one parse unit
		content: Array.from(
			{length: 50},
			(_, i) => `Item ${i}: Array<string> and Map<number, Result<object>> end.`,
		).join('\n'),
	},
];

/** Parse via streaming parser (one-shot feed) + tree bridge. */
const mdz_parse_stream = (content: string): unknown => {
	const parser = new MdzStreamParser();
	parser.feed(content);
	parser.finish();
	return mdz_opcodes_to_nodes(parser.take_opcodes());
};

/** Streaming parser opcode generation only (no tree bridge). */
const mdz_parse_opcodes_only = (content: string): unknown => {
	const parser = new MdzStreamParser();
	parser.feed(content);
	parser.finish();
	return parser.take_opcodes();
};

const parsers = [
	{name: 'single-pass', parse: mdz_parse},
	{name: 'lexer-based', parse: mdz_parse_lexer},
	{name: 'streaming', parse: mdz_parse_stream},
	{name: 'opcodes-only', parse: mdz_parse_opcodes_only},
];

// -- Benchmark --

const bench = new Benchmark({
	duration_ms: 3000,
	warmup_iterations: 20,
	min_iterations: 50,
});

for (const input of inputs) {
	for (const parser of parsers) {
		bench.add(`${parser.name}: ${input.name}`, () => {
			parser.parse(input.content);
		});
	}
}

await bench.run();

console.log('\n mdz Parser Benchmark Results\n');
console.log(bench.table());

// Throughput table — normalizes across input sizes to spot pathologies at a glance.
// A significantly lower MB/s for one input signals non-linear scaling.
console.log('\n Throughput (MB/s)\n');

const results_by_name = bench.results_by_name();
const parser_names = parsers.map((p) => p.name);

// Header
const col_w = 12;
const name_w = 16;
console.log(
	'  ' +
		''.padEnd(name_w) +
		parser_names.map((p) => p.padStart(col_w)).join('') +
		'    chars'.padStart(col_w),
);
console.log('  ' + '-'.repeat(name_w + parser_names.length * col_w + col_w));

for (const input of inputs) {
	const cols = parser_names.map((parser_name) => {
		const result = results_by_name.get(`${parser_name}: ${input.name}`);
		if (!result) return '—'.padStart(col_w);
		const mb_per_sec = (result.stats.ops_per_second * input.content.length) / 1_000_000;
		return mb_per_sec.toFixed(1).padStart(col_w);
	});
	console.log(
		'  ' + input.name.padEnd(name_w) + cols.join('') + String(input.content.length).padStart(col_w),
	);
}

console.log('\n Summary\n');
console.log(bench.summary());

// -- Baseline comparison --

const comparison = await benchmark_baseline_compare(bench.results(), {
	path: BASELINE_PATH,
	regression_threshold: 1.1, // 10% threshold — system-level variance (thermal, scheduler) easily causes 5-8% swings
	staleness_warning_days: 30,
});

console.log('\n Baseline Comparison\n');
console.log(benchmark_baseline_format(comparison));

if (save_baseline) {
	await benchmark_baseline_save(bench.results(), {path: BASELINE_PATH});
	const content = await readFile(BASELINE_FILE, 'utf-8');
	const formatted = await format_file(content, {filepath: BASELINE_FILE});
	await writeFile(BASELINE_FILE, formatted);
	console.log(`\n✓ Baseline saved to ${BASELINE_FILE}`);
} else if (comparison.baseline_found && comparison.regressions.length > 0) {
	console.log('\n⚠️  Regressions detected. Run with --save to update baseline if intentional.');
}
