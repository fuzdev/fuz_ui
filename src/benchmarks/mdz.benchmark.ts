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

await bench.run();

console.log('\n📊 mdz Parser Benchmark Results\n');
console.log(bench.table());

console.log('\n📈 Summary\n');
console.log(bench.summary());

console.log('\nInput sizes:');
console.log(`  tiny:   ${INPUT_TINY.length} chars`);
console.log(`  small:  ${INPUT_SMALL.length} chars`);
console.log(`  medium: ${INPUT_MEDIUM.length} chars`);
console.log(`  large:  ${INPUT_LARGE.length} chars`);
