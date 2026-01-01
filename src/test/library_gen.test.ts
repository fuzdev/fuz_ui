import {test, assert, describe} from 'vitest';

import {source_file_from_disknode} from '$lib/library_gen.js';

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
