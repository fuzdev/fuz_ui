import {test, assert, describe} from 'vitest';

import {
	AnalysisContext,
	format_diagnostic,
	type Diagnostic,
	type Type_Extraction_Diagnostic,
	type Signature_Analysis_Diagnostic,
	type Class_Member_Diagnostic,
	type Svelte_Prop_Diagnostic,
} from '$lib/analysis_context.js';

/**
 * Create a type extraction diagnostic for testing.
 */
const create_type_diagnostic = (
	overrides: Partial<Type_Extraction_Diagnostic> = {},
): Type_Extraction_Diagnostic => ({
	kind: 'type_extraction_failed',
	file: '/src/lib/test.ts',
	line: 10,
	column: 5,
	message: 'Failed to extract type',
	severity: 'error',
	symbol_name: 'test_symbol',
	...overrides,
});

/**
 * Create a signature analysis diagnostic for testing.
 */
const create_signature_diagnostic = (
	overrides: Partial<Signature_Analysis_Diagnostic> = {},
): Signature_Analysis_Diagnostic => ({
	kind: 'signature_analysis_failed',
	file: '/src/lib/helpers.ts',
	line: 25,
	column: 1,
	message: 'Failed to analyze signature',
	severity: 'warning',
	function_name: 'helper_fn',
	...overrides,
});

/**
 * Create a class member diagnostic for testing.
 */
const create_class_member_diagnostic = (
	overrides: Partial<Class_Member_Diagnostic> = {},
): Class_Member_Diagnostic => ({
	kind: 'class_member_failed',
	file: '/src/lib/MyClass.ts',
	line: 50,
	column: 3,
	message: 'Failed to analyze class member',
	severity: 'error',
	class_name: 'MyClass',
	member_name: 'my_method',
	...overrides,
});

/**
 * Create a Svelte prop diagnostic for testing.
 */
const create_svelte_prop_diagnostic = (
	overrides: Partial<Svelte_Prop_Diagnostic> = {},
): Svelte_Prop_Diagnostic => ({
	kind: 'svelte_prop_failed',
	file: 'Button.svelte',
	line: 5,
	column: 10,
	message: 'Failed to resolve prop type',
	severity: 'warning',
	component_name: 'Button',
	prop_name: 'variant',
	...overrides,
});

describe('AnalysisContext', () => {
	describe('add', () => {
		test('adds diagnostic to collection', () => {
			const ctx = new AnalysisContext();
			const diagnostic = create_type_diagnostic();

			ctx.add(diagnostic);

			assert.strictEqual(ctx.diagnostics.length, 1);
			assert.strictEqual(ctx.diagnostics[0], diagnostic);
		});

		test('adds multiple diagnostics', () => {
			const ctx = new AnalysisContext();

			ctx.add(create_type_diagnostic());
			ctx.add(create_signature_diagnostic());
			ctx.add(create_class_member_diagnostic());

			assert.strictEqual(ctx.diagnostics.length, 3);
		});

		test('preserves insertion order', () => {
			const ctx = new AnalysisContext();
			const diag1 = create_type_diagnostic({message: 'first'});
			const diag2 = create_signature_diagnostic({message: 'second'});
			const diag3 = create_class_member_diagnostic({message: 'third'});

			ctx.add(diag1);
			ctx.add(diag2);
			ctx.add(diag3);

			assert.strictEqual(ctx.diagnostics[0]!.message, 'first');
			assert.strictEqual(ctx.diagnostics[1]!.message, 'second');
			assert.strictEqual(ctx.diagnostics[2]!.message, 'third');
		});
	});

	describe('has_errors', () => {
		test('returns false when no diagnostics', () => {
			const ctx = new AnalysisContext();

			assert.strictEqual(ctx.has_errors(), false);
		});

		test('returns false when only warnings', () => {
			const ctx = new AnalysisContext();
			ctx.add(create_signature_diagnostic({severity: 'warning'}));
			ctx.add(create_svelte_prop_diagnostic({severity: 'warning'}));

			assert.strictEqual(ctx.has_errors(), false);
		});

		test('returns true when at least one error', () => {
			const ctx = new AnalysisContext();
			ctx.add(create_signature_diagnostic({severity: 'warning'}));
			ctx.add(create_type_diagnostic({severity: 'error'}));

			assert.strictEqual(ctx.has_errors(), true);
		});

		test('returns true when all are errors', () => {
			const ctx = new AnalysisContext();
			ctx.add(create_type_diagnostic({severity: 'error'}));
			ctx.add(create_class_member_diagnostic({severity: 'error'}));

			assert.strictEqual(ctx.has_errors(), true);
		});
	});

	describe('has_warnings', () => {
		test('returns false when no diagnostics', () => {
			const ctx = new AnalysisContext();

			assert.strictEqual(ctx.has_warnings(), false);
		});

		test('returns false when only errors', () => {
			const ctx = new AnalysisContext();
			ctx.add(create_type_diagnostic({severity: 'error'}));
			ctx.add(create_class_member_diagnostic({severity: 'error'}));

			assert.strictEqual(ctx.has_warnings(), false);
		});

		test('returns true when at least one warning', () => {
			const ctx = new AnalysisContext();
			ctx.add(create_type_diagnostic({severity: 'error'}));
			ctx.add(create_signature_diagnostic({severity: 'warning'}));

			assert.strictEqual(ctx.has_warnings(), true);
		});

		test('returns true when all are warnings', () => {
			const ctx = new AnalysisContext();
			ctx.add(create_signature_diagnostic({severity: 'warning'}));
			ctx.add(create_svelte_prop_diagnostic({severity: 'warning'}));

			assert.strictEqual(ctx.has_warnings(), true);
		});
	});

	describe('errors', () => {
		test('returns empty array when no diagnostics', () => {
			const ctx = new AnalysisContext();

			const errors = ctx.errors();

			assert.deepEqual(errors, []);
		});

		test('returns empty array when only warnings', () => {
			const ctx = new AnalysisContext();
			ctx.add(create_signature_diagnostic({severity: 'warning'}));
			ctx.add(create_svelte_prop_diagnostic({severity: 'warning'}));

			const errors = ctx.errors();

			assert.deepEqual(errors, []);
		});

		test('returns only error diagnostics', () => {
			const ctx = new AnalysisContext();
			const error1 = create_type_diagnostic({severity: 'error'});
			const warning = create_signature_diagnostic({severity: 'warning'});
			const error2 = create_class_member_diagnostic({severity: 'error'});

			ctx.add(error1);
			ctx.add(warning);
			ctx.add(error2);

			const errors = ctx.errors();

			assert.strictEqual(errors.length, 2);
			assert.include(errors, error1);
			assert.include(errors, error2);
			assert.notInclude(errors, warning);
		});
	});

	describe('warnings', () => {
		test('returns empty array when no diagnostics', () => {
			const ctx = new AnalysisContext();

			const warnings = ctx.warnings();

			assert.deepEqual(warnings, []);
		});

		test('returns empty array when only errors', () => {
			const ctx = new AnalysisContext();
			ctx.add(create_type_diagnostic({severity: 'error'}));
			ctx.add(create_class_member_diagnostic({severity: 'error'}));

			const warnings = ctx.warnings();

			assert.deepEqual(warnings, []);
		});

		test('returns only warning diagnostics', () => {
			const ctx = new AnalysisContext();
			const error = create_type_diagnostic({severity: 'error'});
			const warning1 = create_signature_diagnostic({severity: 'warning'});
			const warning2 = create_svelte_prop_diagnostic({severity: 'warning'});

			ctx.add(error);
			ctx.add(warning1);
			ctx.add(warning2);

			const warnings = ctx.warnings();

			assert.strictEqual(warnings.length, 2);
			assert.include(warnings, warning1);
			assert.include(warnings, warning2);
			assert.notInclude(warnings, error);
		});
	});

	describe('by_kind', () => {
		test('returns empty array when no diagnostics of kind', () => {
			const ctx = new AnalysisContext();
			ctx.add(create_type_diagnostic());
			ctx.add(create_signature_diagnostic());

			const result = ctx.by_kind('class_member_failed');

			assert.deepEqual(result, []);
		});

		test('filters by type_extraction_failed', () => {
			const ctx = new AnalysisContext();
			const type_diag = create_type_diagnostic();
			ctx.add(type_diag);
			ctx.add(create_signature_diagnostic());
			ctx.add(create_class_member_diagnostic());

			const result = ctx.by_kind('type_extraction_failed');

			assert.strictEqual(result.length, 1);
			assert.strictEqual(result[0], type_diag);
			// Verify type narrowing works - accessing symbol_name should be valid
			assert.strictEqual(result[0]!.symbol_name, 'test_symbol');
		});

		test('filters by signature_analysis_failed', () => {
			const ctx = new AnalysisContext();
			const sig_diag = create_signature_diagnostic();
			ctx.add(create_type_diagnostic());
			ctx.add(sig_diag);
			ctx.add(create_class_member_diagnostic());

			const result = ctx.by_kind('signature_analysis_failed');

			assert.strictEqual(result.length, 1);
			assert.strictEqual(result[0], sig_diag);
			assert.strictEqual(result[0]!.function_name, 'helper_fn');
		});

		test('filters by class_member_failed', () => {
			const ctx = new AnalysisContext();
			const class_diag = create_class_member_diagnostic();
			ctx.add(create_type_diagnostic());
			ctx.add(class_diag);

			const result = ctx.by_kind('class_member_failed');

			assert.strictEqual(result.length, 1);
			assert.strictEqual(result[0], class_diag);
			assert.strictEqual(result[0]!.class_name, 'MyClass');
			assert.strictEqual(result[0]!.member_name, 'my_method');
		});

		test('filters by svelte_prop_failed', () => {
			const ctx = new AnalysisContext();
			const svelte_diag = create_svelte_prop_diagnostic();
			ctx.add(create_type_diagnostic());
			ctx.add(svelte_diag);

			const result = ctx.by_kind('svelte_prop_failed');

			assert.strictEqual(result.length, 1);
			assert.strictEqual(result[0], svelte_diag);
			assert.strictEqual(result[0]!.component_name, 'Button');
			assert.strictEqual(result[0]!.prop_name, 'variant');
		});

		test('returns multiple diagnostics of same kind', () => {
			const ctx = new AnalysisContext();
			const type_diag1 = create_type_diagnostic({symbol_name: 'foo'});
			const type_diag2 = create_type_diagnostic({symbol_name: 'bar'});
			ctx.add(type_diag1);
			ctx.add(create_signature_diagnostic());
			ctx.add(type_diag2);

			const result = ctx.by_kind('type_extraction_failed');

			assert.strictEqual(result.length, 2);
			assert.include(result, type_diag1);
			assert.include(result, type_diag2);
		});
	});

	describe('diagnostics property', () => {
		test('starts as empty array', () => {
			const ctx = new AnalysisContext();

			assert.deepEqual(ctx.diagnostics, []);
		});

		test('contains all added diagnostics', () => {
			const ctx = new AnalysisContext();
			const diag1 = create_type_diagnostic();
			const diag2 = create_signature_diagnostic();

			ctx.add(diag1);
			ctx.add(diag2);

			assert.strictEqual(ctx.diagnostics.length, 2);
			assert.include(ctx.diagnostics, diag1);
			assert.include(ctx.diagnostics, diag2);
		});
	});
});

describe('format_diagnostic', () => {
	describe('basic formatting', () => {
		test('formats error with line and column', () => {
			const diagnostic = create_type_diagnostic({
				file: 'test.ts',
				line: 10,
				column: 5,
				severity: 'error',
				message: 'Type extraction failed',
			});

			const result = format_diagnostic(diagnostic);

			assert.strictEqual(result, './test.ts:10:5: error: Type extraction failed');
		});

		test('formats warning with line and column', () => {
			const diagnostic = create_signature_diagnostic({
				file: 'helpers.ts',
				line: 25,
				column: 1,
				severity: 'warning',
				message: 'Could not analyze signature',
			});

			const result = format_diagnostic(diagnostic);

			assert.strictEqual(result, './helpers.ts:25:1: warning: Could not analyze signature');
		});

		test('formats with line only (null column)', () => {
			const diagnostic = create_type_diagnostic({
				file: 'test.ts',
				line: 10,
				column: null,
				message: 'Error message',
			});

			const result = format_diagnostic(diagnostic);

			assert.strictEqual(result, './test.ts:10: error: Error message');
		});

		test('formats with no location (null line and column)', () => {
			const diagnostic = create_type_diagnostic({
				file: 'test.ts',
				line: null,
				column: null,
				message: 'Error message',
			});

			const result = format_diagnostic(diagnostic);

			assert.strictEqual(result, './test.ts: error: Error message');
		});
	});

	describe('prefix option', () => {
		test('uses default ./ prefix', () => {
			const diagnostic = create_type_diagnostic({file: 'test.ts'});

			const result = format_diagnostic(diagnostic);

			assert.ok(result.startsWith('./'));
		});

		test('uses custom prefix', () => {
			const diagnostic = create_type_diagnostic({file: 'test.ts', line: 1, column: 1});

			const result = format_diagnostic(diagnostic, {prefix: 'src/'});

			assert.strictEqual(result, 'src/test.ts:1:1: error: Failed to extract type');
		});

		test('uses empty prefix', () => {
			const diagnostic = create_type_diagnostic({file: 'test.ts', line: 1, column: 1});

			const result = format_diagnostic(diagnostic, {prefix: ''});

			assert.strictEqual(result, 'test.ts:1:1: error: Failed to extract type');
		});
	});

	describe('strip_base option', () => {
		test('strips base path from absolute file path', () => {
			const diagnostic = create_type_diagnostic({
				file: '/home/user/project/src/lib/test.ts',
				line: 10,
				column: 5,
			});

			const result = format_diagnostic(diagnostic, {
				strip_base: '/home/user/project/',
			});

			assert.strictEqual(result, './src/lib/test.ts:10:5: error: Failed to extract type');
		});

		test('strips base path and removes leading slash', () => {
			const diagnostic = create_type_diagnostic({
				file: '/project/src/test.ts',
				line: 1,
				column: 1,
			});

			const result = format_diagnostic(diagnostic, {
				strip_base: '/project',
			});

			// strip_base removes "/project", leaving "/src/test.ts"
			// Then leading slash is removed, leaving "src/test.ts"
			assert.strictEqual(result, './src/test.ts:1:1: error: Failed to extract type');
		});

		test('does not strip if base does not match', () => {
			const diagnostic = create_type_diagnostic({
				file: '/other/path/test.ts',
				line: 1,
				column: 1,
			});

			const result = format_diagnostic(diagnostic, {
				strip_base: '/home/user/project/',
			});

			assert.strictEqual(result, './/other/path/test.ts:1:1: error: Failed to extract type');
		});

		test('combines strip_base with custom prefix', () => {
			const diagnostic = create_type_diagnostic({
				file: '/home/user/project/src/lib/test.ts',
				line: 10,
				column: 5,
			});

			const result = format_diagnostic(diagnostic, {
				strip_base: '/home/user/project/',
				prefix: '',
			});

			assert.strictEqual(result, 'src/lib/test.ts:10:5: error: Failed to extract type');
		});
	});

	describe('all diagnostic kinds format correctly', () => {
		test('formats type_extraction_failed', () => {
			const diagnostic = create_type_diagnostic({
				file: 'test.ts',
				line: 10,
				column: 5,
			});

			const result = format_diagnostic(diagnostic);

			assert.include(result, 'test.ts:10:5');
			assert.include(result, 'error');
		});

		test('formats signature_analysis_failed', () => {
			const diagnostic = create_signature_diagnostic({
				file: 'helpers.ts',
				line: 25,
				column: 1,
			});

			const result = format_diagnostic(diagnostic);

			assert.include(result, 'helpers.ts:25:1');
		});

		test('formats class_member_failed', () => {
			const diagnostic = create_class_member_diagnostic({
				file: 'MyClass.ts',
				line: 50,
				column: 3,
			});

			const result = format_diagnostic(diagnostic);

			assert.include(result, 'MyClass.ts:50:3');
		});

		test('formats svelte_prop_failed', () => {
			const diagnostic = create_svelte_prop_diagnostic({
				file: 'Button.svelte',
				line: 5,
				column: 10,
			});

			const result = format_diagnostic(diagnostic);

			assert.include(result, 'Button.svelte:5:10');
		});
	});
});

describe('diagnostic type discrimination', () => {
	test('diagnostics can be narrowed by kind', () => {
		const diagnostics: Array<Diagnostic> = [
			create_type_diagnostic(),
			create_signature_diagnostic(),
			create_class_member_diagnostic(),
			create_svelte_prop_diagnostic(),
		];

		for (const d of diagnostics) {
			switch (d.kind) {
				case 'type_extraction_failed':
					// Type narrowing should allow accessing symbol_name
					assert.ok(d.symbol_name);
					break;
				case 'signature_analysis_failed':
					// Type narrowing should allow accessing function_name
					assert.ok(d.function_name);
					break;
				case 'class_member_failed':
					// Type narrowing should allow accessing class_name and member_name
					assert.ok(d.class_name);
					assert.ok(d.member_name);
					break;
				case 'svelte_prop_failed':
					// Type narrowing should allow accessing component_name and prop_name
					assert.ok(d.component_name);
					assert.ok(d.prop_name);
					break;
			}
		}
	});
});
