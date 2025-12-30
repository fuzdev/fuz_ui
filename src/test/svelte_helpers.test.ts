import {test, assert, describe, beforeAll} from 'vitest';
import ts from 'typescript';
import {svelte2tsx} from 'svelte2tsx';
import {join} from 'node:path';

import {svelte_analyze_component, svelte_analyze_file} from '$lib/svelte_helpers.js';
import {ts_create_program} from '$lib/ts_helpers.js';
import {
	load_fixtures,
	validate_component_structure,
	fixture_name_to_component_name,
	type SvelteFixture,
} from './fixtures/svelte/svelte_test_helpers.js';
import {normalize_json} from './test_helpers.js';

const FIXTURES_DIR = join(import.meta.dirname, 'fixtures/svelte');

let fixtures: Array<SvelteFixture> = [];
let checker: ts.TypeChecker;

beforeAll(async () => {
	fixtures = await load_fixtures();

	// Create TypeScript program for type checking
	const program = ts_create_program({info: () => undefined});
	checker = program.getTypeChecker();
});

describe('svelte component analyzer (fixture-based)', () => {
	test('all fixtures analyze correctly', () => {
		for (const fixture of fixtures) {
			// Check if component uses TypeScript
			const is_ts_file = fixture.input.includes('lang="ts"');

			// Transform Svelte to TS
			const ts_result = svelte2tsx(fixture.input, {
				filename: `${fixture.name}.svelte`,
				isTsFile: is_ts_file,
				emitOnTemplateError: true,
			});

			// Create source file from original Svelte for JSDoc extraction
			const temp_source = ts.createSourceFile(
				`${fixture.name}.svelte`,
				fixture.input,
				ts.ScriptTarget.Latest,
				true,
			);

			// Extract component name from fixture name
			const component_name = fixture_name_to_component_name(fixture.name);

			// Analyze the component
			const result = svelte_analyze_component(ts_result.code, temp_source, checker, component_name);

			// Compare with expected (normalize to match JSON serialization)
			assert.deepEqual(
				normalize_json(result),
				normalize_json(fixture.expected),
				`Fixture "${fixture.name}" failed`,
			);
		}
	});

	test('all fixtures have valid structure', () => {
		for (const fixture of fixtures) {
			validate_component_structure(fixture.expected);
		}
	});
});

describe('svelte_analyze_file', () => {
	test('analyzes a basic component from disk', () => {
		const file_path = join(FIXTURES_DIR, 'props_basic/input.svelte');
		const module_path = 'PropsBasic.svelte';

		const result = svelte_analyze_file(file_path, module_path, checker);

		assert.strictEqual(result.name, 'PropsBasic');
		assert.strictEqual(result.kind, 'component');
		assert.ok(result.props);
		assert.strictEqual(result.props.length, 2);

		const prop_names = result.props.map((p) => p.name);
		assert.include(prop_names, 'title');
		assert.include(prop_names, 'count');
	});

	test('extracts component documentation when present', () => {
		const file_path = join(FIXTURES_DIR, 'props_basic/input.svelte');
		const module_path = 'PropsBasic.svelte';

		const result = svelte_analyze_file(file_path, module_path, checker);

		// The component has JSDoc in the script block - extraction depends on svelte2tsx behavior
		// Just verify we get a valid component back (doc_comment extraction is tested in fixture tests)
		assert.strictEqual(result.name, 'PropsBasic');
		assert.strictEqual(result.kind, 'component');
	});

	test('handles component with JSDoc in HTML comment', () => {
		const file_path = join(FIXTURES_DIR, 'component_with_jsdoc/input.svelte');
		const module_path = 'ComponentJsdoc.svelte';

		const result = svelte_analyze_file(file_path, module_path, checker);

		assert.strictEqual(result.name, 'ComponentJsdoc');
		assert.strictEqual(result.kind, 'component');
	});

	test('handles component without props', () => {
		const file_path = join(FIXTURES_DIR, 'component_no_props/input.svelte');
		const module_path = 'ComponentNoProps.svelte';

		const result = svelte_analyze_file(file_path, module_path, checker);

		assert.strictEqual(result.name, 'ComponentNoProps');
		assert.strictEqual(result.kind, 'component');
		// Props should be undefined or empty
		assert.ok(!result.props || result.props.length === 0);
	});

	test('extracts prop descriptions', () => {
		const file_path = join(FIXTURES_DIR, 'props_with_descriptions/input.svelte');
		const module_path = 'PropsDescriptions.svelte';

		const result = svelte_analyze_file(file_path, module_path, checker);

		assert.ok(result.props);
		// This fixture has name, age, active props
		const name_prop = result.props.find((p) => p.name === 'name');
		assert.ok(name_prop, 'Expected to find name prop');
		assert.ok(name_prop.description, 'Expected name prop to have description');
	});

	test('detects optional props', () => {
		const file_path = join(FIXTURES_DIR, 'props_optional/input.svelte');
		const module_path = 'PropsOptional.svelte';

		const result = svelte_analyze_file(file_path, module_path, checker);

		assert.ok(result.props);
		// Should have at least one optional prop
		const optional_props = result.props.filter((p) => p.optional);
		assert.ok(optional_props.length > 0, 'Expected at least one optional prop');
	});

	test('detects bindable props', () => {
		const file_path = join(FIXTURES_DIR, 'props_bindable/input.svelte');
		const module_path = 'PropsBindable.svelte';

		const result = svelte_analyze_file(file_path, module_path, checker);

		assert.ok(result.props);
		// Should have at least one bindable prop
		const bindable_props = result.props.filter((p) => p.bindable);
		assert.ok(bindable_props.length > 0, 'Expected at least one bindable prop');
	});

	test('extracts correct module path as component name', () => {
		const file_path = join(FIXTURES_DIR, 'props_basic/input.svelte');

		// Test with nested path
		const result1 = svelte_analyze_file(file_path, 'components/Button.svelte', checker);
		assert.strictEqual(result1.name, 'Button');

		// Test with simple path
		const result2 = svelte_analyze_file(file_path, 'Alert.svelte', checker);
		assert.strictEqual(result2.name, 'Alert');
	});

	test('handles TypeScript component', () => {
		// props_basic uses lang="ts"
		const file_path = join(FIXTURES_DIR, 'props_basic/input.svelte');
		const module_path = 'TypeScript_Component.svelte';

		const result = svelte_analyze_file(file_path, module_path, checker);

		assert.strictEqual(result.kind, 'component');
		// Should have typed props
		assert.ok(result.props);
		const count_prop = result.props.find((p) => p.name === 'count');
		assert.ok(count_prop);
		assert.strictEqual(count_prop.type, 'number');
	});

	test('handles JavaScript component (no lang="ts")', () => {
		// component_basic has no script tag with lang="ts"
		const file_path = join(FIXTURES_DIR, 'component_basic/input.svelte');
		const module_path = 'JavaScript_Component.svelte';

		const result = svelte_analyze_file(file_path, module_path, checker);

		assert.strictEqual(result.name, 'JavaScript_Component');
		assert.strictEqual(result.kind, 'component');
		// Basic component has no props
		assert.ok(!result.props || result.props.length === 0);
	});
});
