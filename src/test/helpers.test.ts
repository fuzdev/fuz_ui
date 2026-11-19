import { test, assert, describe } from 'vitest';

import { dedent_continuation_lines } from '#lib/helpers.ts';

describe('dedent_continuation_lines', () => {
	test('a single line is unchanged', () => {
		assert.strictEqual(dedent_continuation_lines('  red'), '  red');
	});

	test('strips a common tab indent from continuation lines', () => {
		assert.strictEqual(
			dedent_continuation_lines('0 0 0 1px\n\t\tred,\n\t\t0 1px 2px blue'),
			'0 0 0 1px\nred,\n0 1px 2px blue'
		);
	});

	test('strips a common space indent, keeping deeper relative indent', () => {
		assert.strictEqual(dedent_continuation_lines('a,\n    b,\n      c'), 'a,\nb,\n  c');
	});

	test('the first line keeps its text even when indented', () => {
		assert.strictEqual(dedent_continuation_lines('  a,\n\tb'), '  a,\nb');
	});

	test('blank and whitespace-only lines are skipped for the prefix and emptied', () => {
		assert.strictEqual(dedent_continuation_lines('a,\n\n\t\tb,\n \n\t\tc'), 'a,\n\nb,\n\nc');
	});

	test('CRLF line endings normalize to LF', () => {
		assert.strictEqual(dedent_continuation_lines('a,\r\n\tb,\r\n\tc'), 'a,\nb,\nc');
	});

	test('mixed indentation strips only the shared whitespace prefix', () => {
		// both indents are two characters wide, but only the leading tab is shared
		assert.strictEqual(dedent_continuation_lines('a,\n\t x,\n\t\tb'), 'a,\n x,\n\tb');
		// spaces against a tab share nothing, so nothing is stripped
		assert.strictEqual(dedent_continuation_lines('a,\n  x,\n\tb'), 'a,\n  x,\n\tb');
	});

	test('unindented continuation lines are unchanged', () => {
		assert.strictEqual(dedent_continuation_lines('a,\nb'), 'a,\nb');
	});

	test('a less-indented closing line narrows the prefix, keeping inner indent', () => {
		assert.strictEqual(
			dedent_continuation_lines('calc(\n\t\t\t1px +\n\t\t\t2px\n\t\t)'),
			'calc(\n\t1px +\n\t2px\n)'
		);
	});
});
