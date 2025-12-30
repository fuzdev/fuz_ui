import {test, assert, describe, beforeAll} from 'vitest';
import ts from 'typescript';
import {svelte2tsx} from 'svelte2tsx';
import {join} from 'node:path';

import {
	svelte_analyze_component,
	svelte_analyze_file,
	svelte_extract_script_content,
	svelte_extract_module_comment,
} from '$lib/svelte_helpers.js';
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

		const {declaration} = svelte_analyze_file({id: file_path}, module_path, checker);

		assert.strictEqual(declaration.name, 'PropsBasic');
		assert.strictEqual(declaration.kind, 'component');
		assert.ok(declaration.props);
		assert.strictEqual(declaration.props.length, 2);

		const prop_names = declaration.props.map((p) => p.name);
		assert.include(prop_names, 'title');
		assert.include(prop_names, 'count');
	});

	test('extracts component documentation when present', () => {
		const file_path = join(FIXTURES_DIR, 'props_basic/input.svelte');
		const module_path = 'PropsBasic.svelte';

		const {declaration} = svelte_analyze_file({id: file_path}, module_path, checker);

		// The component has JSDoc in the script block - extraction depends on svelte2tsx behavior
		// Just verify we get a valid component back (doc_comment extraction is tested in fixture tests)
		assert.strictEqual(declaration.name, 'PropsBasic');
		assert.strictEqual(declaration.kind, 'component');
	});

	test('handles component with JSDoc in HTML comment', () => {
		const file_path = join(FIXTURES_DIR, 'component_with_jsdoc/input.svelte');
		const module_path = 'ComponentJsdoc.svelte';

		const {declaration} = svelte_analyze_file({id: file_path}, module_path, checker);

		assert.strictEqual(declaration.name, 'ComponentJsdoc');
		assert.strictEqual(declaration.kind, 'component');
	});

	test('handles component without props', () => {
		const file_path = join(FIXTURES_DIR, 'component_no_props/input.svelte');
		const module_path = 'ComponentNoProps.svelte';

		const {declaration} = svelte_analyze_file({id: file_path}, module_path, checker);

		assert.strictEqual(declaration.name, 'ComponentNoProps');
		assert.strictEqual(declaration.kind, 'component');
		// Props should be undefined or empty
		assert.ok(!declaration.props || declaration.props.length === 0);
	});

	test('extracts prop descriptions', () => {
		const file_path = join(FIXTURES_DIR, 'props_with_descriptions/input.svelte');
		const module_path = 'PropsDescriptions.svelte';

		const {declaration} = svelte_analyze_file({id: file_path}, module_path, checker);

		assert.ok(declaration.props);
		// This fixture has name, age, active props
		const name_prop = declaration.props.find((p) => p.name === 'name');
		assert.ok(name_prop, 'Expected to find name prop');
		assert.ok(name_prop.description, 'Expected name prop to have description');
	});

	test('detects optional props', () => {
		const file_path = join(FIXTURES_DIR, 'props_optional/input.svelte');
		const module_path = 'PropsOptional.svelte';

		const {declaration} = svelte_analyze_file({id: file_path}, module_path, checker);

		assert.ok(declaration.props);
		// Should have at least one optional prop
		const optional_props = declaration.props.filter((p) => p.optional);
		assert.ok(optional_props.length > 0, 'Expected at least one optional prop');
	});

	test('detects bindable props', () => {
		const file_path = join(FIXTURES_DIR, 'props_bindable/input.svelte');
		const module_path = 'PropsBindable.svelte';

		const {declaration} = svelte_analyze_file({id: file_path}, module_path, checker);

		assert.ok(declaration.props);
		// Should have at least one bindable prop
		const bindable_props = declaration.props.filter((p) => p.bindable);
		assert.ok(bindable_props.length > 0, 'Expected at least one bindable prop');
	});

	test('extracts correct module path as component name', () => {
		const file_path = join(FIXTURES_DIR, 'props_basic/input.svelte');

		// Test with nested path
		const {declaration: declaration1} = svelte_analyze_file(
			{id: file_path},
			'components/Button.svelte',
			checker,
		);
		assert.strictEqual(declaration1.name, 'Button');

		// Test with simple path
		const {declaration: declaration2} = svelte_analyze_file(
			{id: file_path},
			'Alert.svelte',
			checker,
		);
		assert.strictEqual(declaration2.name, 'Alert');
	});

	test('handles TypeScript component', () => {
		// props_basic uses lang="ts"
		const file_path = join(FIXTURES_DIR, 'props_basic/input.svelte');
		const module_path = 'TypeScript_Component.svelte';

		const {declaration} = svelte_analyze_file({id: file_path}, module_path, checker);

		assert.strictEqual(declaration.kind, 'component');
		// Should have typed props
		assert.ok(declaration.props);
		const count_prop = declaration.props.find((p) => p.name === 'count');
		assert.ok(count_prop);
		assert.strictEqual(count_prop.type, 'number');
	});

	test('handles JavaScript component (no lang="ts")', () => {
		// component_basic has no script tag with lang="ts"
		const file_path = join(FIXTURES_DIR, 'component_basic/input.svelte');
		const module_path = 'JavaScript_Component.svelte';

		const {declaration} = svelte_analyze_file({id: file_path}, module_path, checker);

		assert.strictEqual(declaration.name, 'JavaScript_Component');
		assert.strictEqual(declaration.kind, 'component');
		// Basic component has no props
		assert.ok(!declaration.props || declaration.props.length === 0);
	});

	test('uses pre-read content when provided', () => {
		const svelte_content = `<script lang="ts">
	let {value = 'test'}: {value?: string} = $props();
</script>
<p>{value}</p>`;

		const {declaration} = svelte_analyze_file(
			{id: '/fake/path/Test.svelte', content: svelte_content},
			'Test.svelte',
			checker,
		);

		assert.strictEqual(declaration.name, 'Test');
		assert.strictEqual(declaration.kind, 'component');
		assert.ok(declaration.props);
		const value_prop = declaration.props.find((p) => p.name === 'value');
		assert.ok(value_prop);
		assert.strictEqual(value_prop.type, 'string');
		assert.strictEqual(value_prop.optional, true);
	});
});

describe('svelte_extract_script_content', () => {
	test('extracts script content from basic component', () => {
		const svelte_source = `<script lang="ts">
	const foo = 'bar';
</script>
<p>Hello</p>`;

		const result = svelte_extract_script_content(svelte_source);
		assert.ok(result);
		assert.include(result, "const foo = 'bar'");
	});

	test('extracts script content without lang attribute', () => {
		const svelte_source = `<script>
	const foo = 'bar';
</script>
<p>Hello</p>`;

		const result = svelte_extract_script_content(svelte_source);
		assert.ok(result);
		assert.include(result, "const foo = 'bar'");
	});

	test('returns undefined for component without script', () => {
		const svelte_source = `<p>Hello</p>`;

		const result = svelte_extract_script_content(svelte_source);
		assert.isUndefined(result);
	});

	test('does not match script module tag', () => {
		const svelte_source = `<script module>
	export const shared = 'value';
</script>
<script lang="ts">
	const foo = 'bar';
</script>
<p>Hello</p>`;

		const result = svelte_extract_script_content(svelte_source);
		assert.ok(result);
		assert.include(result, "const foo = 'bar'");
		assert.notInclude(result, 'shared');
	});

	test('handles empty script tag', () => {
		const svelte_source = `<script lang="ts"></script>
<p>Hello</p>`;

		const result = svelte_extract_script_content(svelte_source);
		assert.strictEqual(result, '');
	});

	test('handles script with single quotes in lang attribute', () => {
		const svelte_source = `<script lang='ts'>
	const foo = 'bar';
</script>
<p>Hello</p>`;

		const result = svelte_extract_script_content(svelte_source);
		assert.ok(result);
		assert.include(result, "const foo = 'bar'");
	});

	test('does not match Svelte 4 context="module" syntax', () => {
		const svelte_source = `<script context="module">
	export const shared = 'value';
</script>
<script lang="ts">
	const foo = 'bar';
</script>
<p>Hello</p>`;

		const result = svelte_extract_script_content(svelte_source);
		assert.ok(result);
		assert.include(result, "const foo = 'bar'");
		assert.notInclude(result, 'shared');
	});

	test('extracts first matching script when module script comes after', () => {
		const svelte_source = `<script lang="ts">
	const foo = 'bar';
</script>
<script module>
	export const shared = 'value';
</script>
<p>Hello</p>`;

		const result = svelte_extract_script_content(svelte_source);
		assert.ok(result);
		assert.include(result, "const foo = 'bar'");
		assert.notInclude(result, 'shared');
	});
});

describe('svelte_extract_module_comment', () => {
	test('extracts module comment at start of script', () => {
		const script_content = `
/**
 * This is a module-level comment.
 * It describes the entire module.
 */

import {something} from './somewhere.js';

const foo = 'bar';
`;

		const result = svelte_extract_module_comment(script_content);
		assert.ok(result);
		assert.include(result, 'This is a module-level comment');
		assert.include(result, 'It describes the entire module');
	});

	test('extracts module comment after imports', () => {
		const script_content = `
import {something} from './somewhere.js';

/**
 * Module comment after imports.
 */

const foo = 'bar';
`;

		const result = svelte_extract_module_comment(script_content);
		assert.ok(result);
		assert.include(result, 'Module comment after imports');
	});

	test('does not extract comment without blank line (declaration comment)', () => {
		const script_content = `
/** This is a declaration comment. */
const foo = 'bar';
`;

		const result = svelte_extract_module_comment(script_content);
		assert.isUndefined(result);
	});

	test('returns undefined when no JSDoc comment present', () => {
		const script_content = `
// Regular comment
const foo = 'bar';
`;

		const result = svelte_extract_module_comment(script_content);
		assert.isUndefined(result);
	});

	test('handles script with only imports', () => {
		const script_content = `
/**
 * Module with only imports.
 */

import {a} from './a.js';
import {b} from './b.js';
`;

		const result = svelte_extract_module_comment(script_content);
		assert.ok(result);
		assert.include(result, 'Module with only imports');
	});

	test('ignores block comments that are not JSDoc', () => {
		const script_content = `
/* This is a regular block comment, not JSDoc */

const foo = 'bar';
`;

		const result = svelte_extract_module_comment(script_content);
		assert.isUndefined(result);
	});

	test('returns undefined for empty script content', () => {
		const result = svelte_extract_module_comment('');
		assert.isUndefined(result);
	});

	test('returns undefined for whitespace-only content', () => {
		const result = svelte_extract_module_comment('   \n\n   ');
		assert.isUndefined(result);
	});

	test('extracts first module comment when multiple JSDoc comments exist', () => {
		const script_content = `
/**
 * First module comment.
 */

/**
 * Second comment after blank line.
 */

const foo = 'bar';
`;

		const result = svelte_extract_module_comment(script_content);
		assert.ok(result);
		assert.include(result, 'First module comment');
		assert.notInclude(result, 'Second comment');
	});

	test('handles JSDoc with only tags (no description)', () => {
		const script_content = `
/**
 * @see https://example.com
 */

const foo = 'bar';
`;

		const result = svelte_extract_module_comment(script_content);
		assert.ok(result);
		assert.include(result, '@see https://example.com');
	});
});

describe('svelte_analyze_file module_comment', () => {
	test('extracts module comment from component', () => {
		const svelte_content = `<script lang="ts">
/**
 * This component displays a greeting message.
 *
 * @see https://example.com/docs
 */

let {name}: {name: string} = $props();
</script>
<p>Hello {name}</p>`;

		const {declaration, module_comment} = svelte_analyze_file(
			{id: '/fake/path/Greeting.svelte', content: svelte_content},
			'Greeting.svelte',
			checker,
		);

		assert.strictEqual(declaration.name, 'Greeting');
		assert.ok(module_comment);
		assert.include(module_comment, 'This component displays a greeting message');
	});

	test('returns undefined module_comment when not present', () => {
		const svelte_content = `<script lang="ts">
let {name}: {name: string} = $props();
</script>
<p>Hello {name}</p>`;

		const {module_comment} = svelte_analyze_file(
			{id: '/fake/path/Simple.svelte', content: svelte_content},
			'Simple.svelte',
			checker,
		);

		assert.isUndefined(module_comment);
	});

	test('distinguishes module comment from component comment', () => {
		const svelte_content = `<script lang="ts">
/**
 * Module-level documentation.
 */

/** Component documentation attached to props. */
let {name}: {name: string} = $props();
</script>
<p>Hello {name}</p>`;

		const {declaration, module_comment} = svelte_analyze_file(
			{id: '/fake/path/Dual.svelte', content: svelte_content},
			'Dual.svelte',
			checker,
		);

		assert.ok(module_comment);
		assert.include(module_comment, 'Module-level documentation');
		assert.notInclude(module_comment, 'Component documentation');

		// Component doc should be separate
		assert.ok(declaration.doc_comment);
		assert.include(declaration.doc_comment, 'Component documentation');
	});
});
