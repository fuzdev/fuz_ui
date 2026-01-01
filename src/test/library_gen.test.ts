import {test, assert, describe} from 'vitest';

import {source_file_from_disknode, library_gen_throw_on_duplicates} from '$lib/library_gen.js';
import type {DuplicateInfo} from '$lib/library_gen_helpers.js';

/**
 * Create a mock Disknode for testing.
 * Matches the shape used by source_file_from_disknode.
 */
const create_mock_disknode = (options: {
	id: string;
	contents?: string | null;
	dependencies?: Map<string, unknown>;
	dependents?: Map<string, unknown>;
}) => ({
	id: options.id,
	contents: options.contents ?? null,
	dependencies: options.dependencies ?? new Map(),
	dependents: options.dependents ?? new Map(),
});

describe('source_file_from_disknode', () => {
	test('converts disknode with content to SourceFileInfo', () => {
		const disknode = create_mock_disknode({
			id: '/project/src/lib/helpers.ts',
			contents: 'export const x = 1;',
		});

		const result = source_file_from_disknode(disknode as any);

		assert.strictEqual(result.id, '/project/src/lib/helpers.ts');
		assert.strictEqual(result.content, 'export const x = 1;');
		assert.ok(Array.isArray(result.dependencies));
		assert.ok(Array.isArray(result.dependents));
	});

	test('converts dependencies Map keys to array', () => {
		const deps: Map<string, unknown> = new Map([
			['/project/src/lib/dep_a.ts', {}],
			['/project/src/lib/dep_b.ts', {}],
		]);

		const disknode = create_mock_disknode({
			id: '/project/src/lib/consumer.ts',
			contents: 'import { a } from "./dep_a.js";',
			dependencies: deps,
		});

		const result = source_file_from_disknode(disknode as any);

		assert.strictEqual(result.dependencies?.length, 2);
		// Spread to mutable array for assert.include compatibility
		const dep_list = [...(result.dependencies ?? [])];
		assert.include(dep_list, '/project/src/lib/dep_a.ts');
		assert.include(dep_list, '/project/src/lib/dep_b.ts');
	});

	test('converts dependents Map keys to array', () => {
		const dependents: Map<string, unknown> = new Map([
			['/project/src/lib/user_a.ts', {}],
			['/project/src/lib/user_b.ts', {}],
			['/project/src/lib/user_c.ts', {}],
		]);

		const disknode = create_mock_disknode({
			id: '/project/src/lib/shared.ts',
			contents: 'export const shared = "value";',
			dependents,
		});

		const result = source_file_from_disknode(disknode as any);

		assert.strictEqual(result.dependents?.length, 3);
		// Spread to mutable array for assert.include compatibility
		const dep_list = [...(result.dependents ?? [])];
		assert.include(dep_list, '/project/src/lib/user_a.ts');
		assert.include(dep_list, '/project/src/lib/user_b.ts');
		assert.include(dep_list, '/project/src/lib/user_c.ts');
	});

	test('handles empty dependencies and dependents', () => {
		const disknode = create_mock_disknode({
			id: '/project/src/lib/standalone.ts',
			contents: 'export const standalone = true;',
			dependencies: new Map(),
			dependents: new Map(),
		});

		const result = source_file_from_disknode(disknode as any);

		assert.strictEqual(result.dependencies?.length, 0);
		assert.strictEqual(result.dependents?.length, 0);
	});

	test('throws when disknode has null content', () => {
		const disknode = create_mock_disknode({
			id: '/project/src/lib/unloaded.ts',
			contents: null,
		});

		assert.throws(() => source_file_from_disknode(disknode as any), /Source file has no content/);
		assert.throws(() => source_file_from_disknode(disknode as any), /unloaded\.ts/);
	});

	test('throws when disknode has undefined content', () => {
		const disknode = create_mock_disknode({
			id: '/project/src/lib/undefined_content.ts',
			contents: undefined as any,
		});

		assert.throws(() => source_file_from_disknode(disknode as any), /Source file has no content/);
	});

	test('error message includes file path', () => {
		const disknode = create_mock_disknode({
			id: '/some/specific/path/file.ts',
			contents: null,
		});

		try {
			source_file_from_disknode(disknode as any);
			assert.fail('Should have thrown');
		} catch (e) {
			const message = (e as Error).message;
			assert.include(message, '/some/specific/path/file.ts');
			assert.include(message, 'ensure Gro filer loads file contents');
		}
	});

	test('handles empty string content (valid)', () => {
		const disknode = create_mock_disknode({
			id: '/project/src/lib/empty.ts',
			contents: '', // Empty string is valid content
		});

		const result = source_file_from_disknode(disknode as any);

		assert.strictEqual(result.id, '/project/src/lib/empty.ts');
		assert.strictEqual(result.content, '');
	});

	test('preserves content exactly', () => {
		const content = `/**
 * Module with complex content.
 */

export const multiline = \`
  Line 1
  Line 2
\`;

export function fn(): void {
  // comment
}
`;

		const disknode = create_mock_disknode({
			id: '/project/src/lib/complex.ts',
			contents: content,
		});

		const result = source_file_from_disknode(disknode as any);

		assert.strictEqual(result.content, content);
	});
});

/**
 * Create a mock log object that captures error calls.
 */
const create_mock_log = () => {
	const errors: Array<Array<unknown>> = [];
	return {
		error: (...args: Array<unknown>) => errors.push(args),
		errors,
	};
};

/**
 * Create a DuplicateInfo for testing.
 */
const create_duplicate_info = (
	name: string,
	module: string,
	kind: string = 'function',
	source_line?: number,
): DuplicateInfo => ({
	declaration: {
		name,
		kind: kind as any,
		signature: `${kind} ${name}`,
		source_line,
	},
	module,
});

describe('library_gen_throw_on_duplicates', () => {
	test('does nothing when duplicates map is empty', () => {
		const log = create_mock_log();
		const duplicates: Map<string, Array<DuplicateInfo>> = new Map();

		// Should not throw
		library_gen_throw_on_duplicates(duplicates, log);

		assert.strictEqual(log.errors.length, 0);
	});

	test('throws when duplicates exist', () => {
		const log = create_mock_log();
		const duplicates: Map<string, Array<DuplicateInfo>> = new Map([
			[
				'helper',
				[
					create_duplicate_info('helper', 'utils.ts', 'function', 10),
					create_duplicate_info('helper', 'helpers.ts', 'function', 20),
				],
			],
		]);

		assert.throws(
			() => library_gen_throw_on_duplicates(duplicates, log),
			/1 duplicate declaration name/,
		);
	});

	test('error message pluralizes correctly for multiple duplicates', () => {
		const log = create_mock_log();
		const duplicates: Map<string, Array<DuplicateInfo>> = new Map([
			['foo', [create_duplicate_info('foo', 'a.ts'), create_duplicate_info('foo', 'b.ts')]],
			['bar', [create_duplicate_info('bar', 'c.ts'), create_duplicate_info('bar', 'd.ts')]],
		]);

		assert.throws(
			() => library_gen_throw_on_duplicates(duplicates, log),
			/2 duplicate declaration names/,
		);
	});

	test('logs each duplicate with locations', () => {
		const log = create_mock_log();
		const duplicates: Map<string, Array<DuplicateInfo>> = new Map([
			[
				'Config',
				[
					create_duplicate_info('Config', 'config.ts', 'type', 5),
					create_duplicate_info('Config', 'settings.ts', 'interface', 15),
				],
			],
		]);

		try {
			library_gen_throw_on_duplicates(duplicates, log);
		} catch (_error) {
			// expected
		}

		// Should have logged the header and details
		assert.ok(log.errors.length >= 3, 'should log header and at least 2 locations');

		// Check that module paths and line numbers appear in logs
		const all_logged = log.errors.map((args) => args.join(' ')).join('\n');
		assert.include(all_logged, 'Config');
		assert.include(all_logged, 'config.ts:5');
		assert.include(all_logged, 'settings.ts:15');
		assert.include(all_logged, 'type');
		assert.include(all_logged, 'interface');
	});

	test('handles declarations without source_line', () => {
		const log = create_mock_log();
		const duplicates: Map<string, Array<DuplicateInfo>> = new Map([
			[
				'helper',
				[
					create_duplicate_info('helper', 'a.ts', 'function', undefined),
					create_duplicate_info('helper', 'b.ts', 'function', 10),
				],
			],
		]);

		try {
			library_gen_throw_on_duplicates(duplicates, log);
		} catch (_error) {
			// expected
		}

		const all_logged = log.errors.map((args) => args.join(' ')).join('\n');
		// a.ts should appear without line number, b.ts:10 with
		assert.include(all_logged, 'a.ts (function)');
		assert.include(all_logged, 'b.ts:10 (function)');
	});

	test('error message includes resolution guidance', () => {
		const log = create_mock_log();
		const duplicates: Map<string, Array<DuplicateInfo>> = new Map([
			['x', [create_duplicate_info('x', 'a.ts'), create_duplicate_info('x', 'b.ts')]],
		]);

		try {
			library_gen_throw_on_duplicates(duplicates, log);
			assert.fail('should have thrown');
		} catch (e) {
			const message = (e as Error).message;
			assert.include(message, 'rename');
			assert.include(message, '@nodocs');
		}
	});
});
