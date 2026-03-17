import {Benchmark} from '@fuzdev/fuz_util/benchmark.js';

import {mdz_parse} from '../lib/mdz.js';
import {mdz_parse_lexer} from '../lib/mdz_token_parser.js';

/* eslint-disable no-console */

// -- Benchmark inputs --

const INPUT_TINY = 'hello **bold** world';

const INPUT_SMALL = `# Small Document

This is a _simple_ paragraph with **bold** text and \`inline code\`.

Here's a link: [click here](https://example.com) and an auto-link https://example.com/path.

Some ~strikethrough~ text and more _italic_ words.`;

const INPUT_MEDIUM = `# Medium Document

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

More content with [multiple](https://a.com) links [here](https://b.com) and [there](/c).`;

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

const INPUT_LARGE = generate_large_input();

// Angle brackets without closing tags — exercises tag bail-out paths.
// Before the pre-check fix, unclosed tags like <GodType> caused O(n*k)
// scanning through the rest of the document.
const INPUT_ANGLE_BRACKETS = `# TypeScript-Heavy Document

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
| \`Pick<Deps, 'key'>\` | narrowed deps |`;

// Many unclosed angle brackets in a single paragraph — worst case for
// repeated tag bail-outs within one parse unit
const INPUT_MANY_ANGLES = Array.from(
	{length: 50},
	(_, i) => `Item ${i}: Array<string> and Map<number, Result<object>> end.`,
).join('\n');

// -- Benchmark --

const bench = new Benchmark({
	duration_ms: 3000,
	warmup_iterations: 20,
});

// Tiny input
bench.add('single-pass: tiny', () => {
	mdz_parse(INPUT_TINY);
});
bench.add('lexer-based: tiny', () => {
	mdz_parse_lexer(INPUT_TINY);
});

// Small input
bench.add('single-pass: small', () => {
	mdz_parse(INPUT_SMALL);
});
bench.add('lexer-based: small', () => {
	mdz_parse_lexer(INPUT_SMALL);
});

// Medium input
bench.add('single-pass: medium', () => {
	mdz_parse(INPUT_MEDIUM);
});
bench.add('lexer-based: medium', () => {
	mdz_parse_lexer(INPUT_MEDIUM);
});

// Large input
bench.add('single-pass: large', () => {
	mdz_parse(INPUT_LARGE);
});
bench.add('lexer-based: large', () => {
	mdz_parse_lexer(INPUT_LARGE);
});

// Angle brackets (tag bail-out paths)
bench.add('single-pass: angle brackets', () => {
	mdz_parse(INPUT_ANGLE_BRACKETS);
});
bench.add('lexer-based: angle brackets', () => {
	mdz_parse_lexer(INPUT_ANGLE_BRACKETS);
});

// Many unclosed angles in one paragraph
bench.add('single-pass: many angles', () => {
	mdz_parse(INPUT_MANY_ANGLES);
});
bench.add('lexer-based: many angles', () => {
	mdz_parse_lexer(INPUT_MANY_ANGLES);
});

// Input size map for throughput calculation
const input_sizes: Record<string, number> = {
	tiny: INPUT_TINY.length,
	small: INPUT_SMALL.length,
	medium: INPUT_MEDIUM.length,
	large: INPUT_LARGE.length,
	'angle brackets': INPUT_ANGLE_BRACKETS.length,
	'many angles': INPUT_MANY_ANGLES.length,
};

await bench.run();

console.log('\n mdz Parser Benchmark Results\n');
console.log(bench.table());

// Throughput table — normalizes across input sizes to spot pathologies at a glance.
// A significantly lower MB/s for one input signals non-linear scaling.
console.log('\n Throughput (MB/s)\n');

const results_by_name = bench.results_by_name();
const parsers = ['single-pass', 'lexer-based'];
const input_names = Object.keys(input_sizes);

// Header
const col_w = 12;
const name_w = 16;
console.log(
	'  ' +
		''.padEnd(name_w) +
		parsers.map((p) => p.padStart(col_w)).join('') +
		'    chars'.padStart(col_w),
);
console.log('  ' + '-'.repeat(name_w + parsers.length * col_w + col_w));

for (const input_name of input_names) {
	const size_bytes = input_sizes[input_name]!;
	const cols = parsers.map((parser) => {
		const result = results_by_name.get(`${parser}: ${input_name}`);
		if (!result) return '—'.padStart(col_w);
		const mb_per_sec = (result.stats.ops_per_second * size_bytes) / 1_000_000;
		return mb_per_sec.toFixed(1).padStart(col_w);
	});
	console.log(
		'  ' + input_name.padEnd(name_w) + cols.join('') + String(size_bytes).padStart(col_w),
	);
}

console.log('\n Summary\n');
console.log(bench.summary());
