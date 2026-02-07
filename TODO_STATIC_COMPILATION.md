# Static Compilation for Mdz

Design document for a Svelte preprocessor that compiles `Mdz` component content at build time.

## Overview

**Goal**: Eliminate runtime mdz parsing by expanding static `<Mdz>` content to Svelte markup at build time.

**Approach**: A Svelte preprocessor (`svelte_preprocess_mdz`) that:

1. Detects `<Mdz>` components with static string `content` props
2. Parses the mdz content using `mdz_parse()`
3. Renders each `MdzNode` to equivalent Svelte markup via `mdz_to_svelte()`
4. Replaces the `content` prop with pre-rendered children
5. Manages imports (adds `DocsLink`, `Code`, `resolve`, configured components)

Dynamic `content` props are left untouched for runtime rendering.

**Source of truth**: `Mdz.svelte` and `MdzNodeView.svelte` define the intended rendering behavior. The preprocessor must produce output that is visually and semantically identical to what these components produce at runtime. Any rendering decision in `mdz_to_svelte` should trace back to how `MdzNodeView.svelte` handles that node type. When in doubt, check `MdzNodeView.svelte`.

**Reference implementation**: `svelte_preprocess_fuz_code` in fuz_code demonstrates the preprocessor pattern (AST walking, static content detection, `magic-string` transforms, import resolution).

## Why a Preprocessor

Mdz transformation is naturally inline expansion -- replacing `<Mdz content="...">` with its rendered Svelte markup. This maps directly to the Svelte preprocessor model (source-to-source transform) without the indirection of virtual modules that a Vite plugin would require.

## Architecture

```
src/lib/
├── svelte_preprocess_mdz.ts       # Svelte preprocessor entry point
├── svelte_preprocess_helpers.ts   # Shared preprocessor AST utilities
├── mdz_to_svelte.ts               # MdzNode[] -> Svelte markup string
├── MdzPrecompiled.svelte          # Precompiled wrapper (children snippet)
├── Mdz.svelte                     # Unchanged (runtime parsing)
└── mdz.ts                         # Existing parser (reused)
```

## Configuration

```javascript
// svelte.config.js
import {svelte_preprocess_mdz} from '@fuzdev/fuz_ui/svelte_preprocess_mdz.js';
import {svelte_preprocess_fuz_code} from '@fuzdev/fuz_code/svelte_preprocess_fuz_code.js';
import {vitePreprocess} from '@sveltejs/vite-plugin-svelte';

export default {
	preprocess: [
		svelte_preprocess_mdz({
			components: {
				Alert: '$lib/Alert.svelte',
				Card: '$lib/Card.svelte',
			},
			elements: ['aside', 'details', 'summary'],
		}),
		svelte_preprocess_fuz_code(),
		vitePreprocess(),
	],
};
```

**Ordering matters**: `svelte_preprocess_mdz` runs first and emits `<Code>` components for mdz codeblocks. `svelte_preprocess_fuz_code` runs second and transforms those to pre-highlighted HTML. Then `vitePreprocess` handles TypeScript/CSS.

---

## MdzPrecompiled Approach

The key design decision: instead of modifying `Mdz.svelte` (which would require making `content` optional — a breaking API change), the preprocessor rewrites transformed usages to a new `MdzPrecompiled.svelte` component. This cleanly separates runtime-parsed rendering from precompiled rendering.

`MdzPrecompiled.svelte` accepts `children: Snippet` plus the same wrapper props as `Mdz` (`inline`, `nowrap`, `...rest`). `Mdz.svelte` is **not modified**.

Benefits:

- Zero API change to `Mdz` — existing consumers unaffected
- No ambiguous "no content, no children" state
- Clear separation: `Mdz` = runtime parsing, `MdzPrecompiled` = precompiled wrapper
- `MdzPrecompiled` name in output immediately signals "this is a build artifact"

### Transformation

**Before**:

```svelte
<script lang="ts">
	import Mdz from '@fuzdev/fuz_ui/Mdz.svelte';
</script>

<Mdz content="**bold** and `some_fn`" class="mb_lg" />
<Mdz content="<Alert>warning</Alert>" />
<Mdz content={dynamic_content} />
```

**After**:

```svelte
<script lang="ts">
	import Mdz from '@fuzdev/fuz_ui/Mdz.svelte';
	import MdzPrecompiled from '@fuzdev/fuz_ui/MdzPrecompiled.svelte';
	import DocsLink from '@fuzdev/fuz_ui/DocsLink.svelte';
	import Alert from '$lib/Alert.svelte';
</script>

<MdzPrecompiled class="mb_lg"><p><strong>bold</strong> and <DocsLink reference="some_fn" /></p></MdzPrecompiled>
<MdzPrecompiled><Alert>warning</Alert></MdzPrecompiled>
<Mdz content={dynamic_content} />
```

Key behaviors:

- Static `content` prop removed, replaced with pre-rendered children in `<MdzPrecompiled>`
- All other props (`class`, `inline`, `nowrap`, `style`, etc.) preserved on `<MdzPrecompiled>`
- Required imports (`MdzPrecompiled`, `DocsLink`, `Alert`, `resolve`, `Code`) added to `<script>`
- `Mdz` import **removed** when all usages are transformed and no other references exist
- `Mdz` import **kept** when dynamic usages remain or when `Mdz` is referenced in script/expressions
- Dynamic `content` left untouched as `<Mdz content={...} />`

### Import Removal

The preprocessor removes the `Mdz` import when it is no longer referenced anywhere. This uses `has_identifier_in_tree` to walk both the script AST and template fragment looking for `Identifier` nodes with the Mdz name. `Component.name` in Svelte's AST is a plain string (not an `Identifier` node), so `<Mdz>` template usages don't produce false positives.

An import is removable when:

1. All template `<Mdz>` usages were successfully transformed
2. The import declaration has a single specifier
3. No `Identifier` reference to the name exists in scripts or template expressions

To avoid MagicString boundary conflicts, one removable import is overwritten with the `MdzPrecompiled` import line (instead of separate remove + appendLeft).

---

## Component and Element Resolution

### Build-time Resolution via Config

Components and elements in mdz content are resolved at build time using the preprocessor config:

- **Configured components**: Emitted as real Svelte component imports. Zero runtime overhead.
- **Configured elements**: Emitted as real HTML elements. Zero runtime overhead.
- **Unconfigured components/elements**: The **entire Mdz usage is skipped** -- left as runtime `<Mdz content="...">`. A warning is logged.

```svelte
// Alert is in config -> precompiled
<Mdz content="<Alert>warning</Alert>" />
// becomes:
<Mdz><Alert>warning</Alert></Mdz>

// Foo is NOT in config -> skipped, left as runtime
<Mdz content="<Foo>text</Foo>" />
// stays as:
<Mdz content="<Foo>text</Foo>" />
```

### Config Must Match Runtime Context

The preprocessor `components`/`elements` config must match what the application provides via `mdz_components_context`/`mdz_elements_context` at runtime. These are two views of the same information:

- **Preprocessor config**: Maps component names to import paths (build-time)
- **Runtime context**: Maps component names to component constructors (runtime)

If they're out of sync, precompiled and runtime Mdz usages would render differently. This is a constraint worth documenting but not a new burden -- applications already configure the runtime context.

### Security

Mdz content is parsed through the mdz parser, NOT through Svelte's parser. The preprocessor only emits markup for the node types that `mdz_parse()` produces. Text nodes are escaped (`{` -> `{'{'}`, `}` -> `{'}'}`, `<` -> `&lt;`, `&` -> `&amp;`). Attribute values from user content use expression syntax with `escape_js_string`. There is no path for arbitrary Svelte syntax (`{@html}`, `{#if}`, `use:`, `bind:`, `on:`, etc.) to be injected through mdz content. This is a deliberate security property.

---

## Detection Rules

Following the same pattern as `svelte_preprocess_fuz_code`:

**Static (transform)**:

```svelte
<Mdz content="literal string" />
<Mdz content={'literal string'} />
<Mdz content={`template without interpolation`} />
<Mdz content={'string ' + 'concatenation'} />
<Mdz content={my_const} />                          <!-- const tracing -->
<Mdz content={`prefix ${my_const} suffix`} />        <!-- template interpolation -->
<Mdz content={a + b} />                              <!-- concat with const refs -->
```

**Dynamic (skip)**:

```svelte
<Mdz content={my_let_variable} />
<Mdz content={`template with ${dynamic_expr}`} />
<Mdz content={condition ? 'a' : 'b'} />
<Mdz content={fn()} />
<Mdz content={$state_value} />
```

Static detection uses `extract_static_string` and `evaluate_static_expr` from `@fuzdev/fuz_util/svelte_preprocess_helpers.js` with a bindings map from `build_static_bindings`. Resolves: string literals, template literals (including interpolations with resolvable expressions), string concatenation with `+`, and `Identifier` references to top-level `const` declarations with static initializers. Chained references resolve in declaration order (`const a = 'x'; const b = a;`). Only `const` is traced — `let`/`var` are skipped since they lack single-assignment guarantees.

**Also skip if**:

- Spread attributes present (`<Mdz {...props} />`) -- can't determine content statically
- Content references unconfigured Component/Element names -- fall back to runtime

---

## Options

```typescript
export interface SveltePreprocessMdzOptions {
	/** File patterns to exclude. */
	exclude?: Array<string | RegExp>;

	/**
	 * Component import mapping for mdz content.
	 * Key: component name as used in mdz (e.g., 'Alert').
	 * Value: import path (e.g., '$lib/Alert.svelte').
	 *
	 * If mdz content references a component not in this map,
	 * that Mdz usage is skipped (left as runtime).
	 */
	components?: Record<string, string>;

	/**
	 * Allowed HTML elements in mdz content.
	 * If mdz content references an element not in this list,
	 * that Mdz usage is skipped (left as runtime).
	 */
	elements?: Array<string>;

	/**
	 * Import sources that resolve to the Mdz component.
	 * Used to verify that `<Mdz>` in templates refers to fuz_ui's Mdz.svelte.
	 *
	 * @default ['@fuzdev/fuz_ui/Mdz.svelte']
	 */
	component_imports?: Array<string>;
}
```

Compared to the fuz_code preprocessor, there is no `on_error` option (always throw) and no `cache` option (not needed initially). These can be added later if needed.

---

## Node Rendering

`mdz_to_svelte` converts `MdzNode[]` to a Svelte markup string. Each node type maps to output that matches what `MdzNodeView.svelte` renders at runtime.

| Node Type                       | Svelte Output                                                   | Required Import             |
| ------------------------------- | --------------------------------------------------------------- | --------------------------- |
| Text                            | escaped text (see escaping section)                             | None                        |
| Code                            | `<DocsLink reference={'content'} />`                            | `DocsLink`                  |
| Codeblock (lang string)         | `<Code lang={'lang'} content={'escaped'} />`                    | `Code`                      |
| Codeblock (lang null)           | `<Code lang={null} content={'escaped'} />`                      | `Code`                      |
| Bold                            | `<strong>{children}</strong>`                                   | None                        |
| Italic                          | `<em>{children}</em>`                                           | None                        |
| Strikethrough                   | `<s>{children}</s>`                                             | None                        |
| Link (internal)                 | `<a href={resolve('path')}>{children}</a>`                      | `resolve` from `$app/paths` |
| Link (internal, fragment/query) | `<a href={'#fragment'}>{children}</a>`                          | None                        |
| Link (external)                 | `<a href={'url'} target="_blank" rel="noopener">{children}</a>` | None                        |
| Paragraph                       | `<p>{children}</p>`                                             | None                        |
| Hr                              | `<hr />`                                                        | None                        |
| Heading                         | `<h{level}>{children}</h{level}>`                               | None                        |
| Element (configured)            | `<{name}>{children}</{name}>`                                   | None                        |
| Component (configured)          | `<{Name}>{children}</{Name}>`                                   | Configured import path      |

All attribute values from user content use expression syntax (`attr={'escaped'}`) with `escape_js_string` rather than double-quoted attributes (`attr="value"`). This matches how `MdzNodeView.svelte` passes values via expressions (`reference={node.content}`, `href={reference}`), and provides a uniform escaping model -- only `escape_js_string` is needed, avoiding the complexity of HTML attribute escaping.

### Internal Links and resolve()

`MdzNodeView.svelte` uses `resolve()` from `$app/paths` for internal links, with special handling for fragment/query-only links:

```svelte
// Internal link /docs/foo -> uses resolve()
<a href={resolve('/docs/foo')}>text</a>

// Fragment-only #section -> expression syntax, no resolve
<a href={'#section'}>text</a>

// Query-only ?tab=1 -> expression syntax, no resolve
<a href={'?tab=1'}>text</a>
```

The preprocessor replicates this: fragment (`#`) and query (`?`) links use the raw reference, all other internal links use `resolve()`.

### Codeblock Integration

Mdz codeblocks emit `<Code>` components with expression syntax for both `lang` and `content`:

```svelte
// With language hint
<Code lang={'ts'} content={'const x = 1;'} />

// Without language hint (null)
<Code lang={null} content={'some code'} />
```

The `svelte_preprocess_fuz_code` preprocessor runs after and transforms these to pre-highlighted `dangerous_raw_html`. This requires:

1. The mdz preprocessor adds `import Code from '@fuzdev/fuz_code/Code.svelte'`
2. Correct ordering in `svelte.config.js` (mdz first, code second)

### Codeblock Content Escaping

Both `lang` and `content` use single-quoted JS expressions: `attr={'escaped string'}` with `escape_js_string` (escapes `\`, `'`, `\n`, `\r`). When `lang` is `null` (no language hint), emit `lang={null}` to match the runtime behavior where `MdzNodeView.svelte` passes `lang={node.lang}`.

### Code (Inline) Escaping

Inline code nodes emit `<DocsLink reference={'escaped'} />` using `escape_js_string` for the reference value. This matches `MdzNodeView.svelte` which uses `reference={node.content}` (expression syntax). Double-quoted attributes (`reference="value"`) are NOT used because the content may contain `"`, `{`, or other special characters.

---

## Svelte Text Escaping

Mdz content may contain characters that are special in Svelte templates.

```svelte
// Input
<Mdz content="Use {#if} for conditionals" />

// BROKEN - Svelte tries to parse {#if}
<Mdz>Use {#if} for conditionals</Mdz>

// CORRECT - curlies escaped
<Mdz><p>Use {'{'} #if {'}'} for conditionals</p></Mdz>
```

Text nodes escape four characters using a **single-pass** regex replacement:

```typescript
const escape_svelte_text = (text: string): string => {
	return text.replace(/[{}<&]/g, (ch) => {
		switch (ch) {
			case '{':
				return "{'{'}";
			case '}':
				return "{'}'}";
			case '<':
				return '&lt;';
			case '&':
				return '&amp;';
			default:
				return ch;
		}
	});
};
```

**Why single-pass**: Sequential `.replace()` calls are broken because the second replacement corrupts output from the first. For example, replacing `{` first produces `{'{'}`, then replacing `}` catches the `}` from that output, producing `{'{'{'}'}`—invalid Svelte. A single-pass regex with a callback function processes each character in the original string exactly once.

**Why `&` is escaped**: Runtime `MdzNodeView.svelte` renders text with `{node.content}` (a Svelte expression). Svelte auto-escapes expression output, converting `&` to `&amp;` in the DOM. The preprocessor emits raw template text where `&` is NOT auto-escaped—it would be interpreted as a potential HTML entity by the browser. Escaping `&` to `&amp;` matches the runtime behavior. For example, if mdz text contains `&amp;` literally, the preprocessor emits `&amp;amp;` so the browser renders `&amp;` (matching what the runtime would show).

**Why `<` is escaped**: Bare `<` in text nodes (rejected by the mdz tag parser) must become `&lt;` to prevent the Svelte template parser from interpreting them as tag openers.

---

## Implementation

### Preprocessor Entry Point ✓

Implemented in `src/lib/svelte_preprocess_mdz.ts`. Key structure:

1. Quick bail-outs: `should_exclude`, string inclusion check for import sources
2. AST parse with `svelte/compiler`, resolve local Mdz names via `resolve_component_names`
3. `find_mdz_usages` — zimmerframe `walk()` with `Component` visitor, extracts static content, skips spreads/unconfigured tags, calls `mdz_parse` + `mdz_to_svelte`
4. `build_replacement` — reconstructs `<Tag ...attrs>children</Tag>` via source slicing
5. `add_imports` — dedup by name+path, handles no-script (prepend), module-only (insert after), instance script (append at import position)
6. Apply via `MagicString.overwrite`, return code + source map

### resolve_mdz_names ✓ → `resolve_component_names`

Extracted to `svelte_preprocess_helpers.ts` as `resolve_component_names`. Scans both instance and module scripts for `ImportDeclaration` nodes matching the configured import sources. Skips `ImportNamespaceSpecifier` (`import * as Mdz`) since namespace objects aren't valid component references. The preprocessor calls it as:

```typescript
const mdz_names = resolve_component_names(ast, component_imports);
```

### find_mdz_usages ✓

Walks the AST with `zimmerframe`'s `walk()`. For each Mdz component:

1. `ctx.next()` to recurse into children (finds nested Mdz inside other components/elements)
2. Skip if spread attributes present (`SpreadAttribute` type check)
3. Extract `content` attribute value using `extract_static_string`
4. Parse: `mdz_parse(content_value)`
5. Render: `mdz_to_svelte(nodes, options)` — returns markup, imports, and `has_unconfigured_tags`
6. Skip if `has_unconfigured_tags` is true (fall back to runtime)
7. `build_replacement` — overwrites entire component node (`start` to `end`), reconstructing `<Tag ...attrs>children</Tag>` via source text slicing of non-content attributes
8. Record transformation with start/end/replacement and required imports

### mdz_to_svelte ✓

Implemented in `src/lib/mdz_to_svelte.ts`. Exports:

- `mdz_to_svelte(nodes, options)` — main conversion function
- `escape_svelte_text(text)` — single-pass escaping for Svelte template text
- `escape_js_string(value)` — escaping for single-quoted JS string expressions
- `MdzToSvelteOptions` — options interface
- `MdzToSvelteResult` — result interface

```typescript
export interface MdzToSvelteOptions {
	components: Record<string, string>;
	elements: Array<string>;
}

export interface MdzToSvelteResult {
	/** Generated Svelte markup string. */
	markup: string;
	/** Required imports: Map<local_name, {path, kind}>. */
	imports: Map<string, {path: string; kind: 'default' | 'named'}>;
	/** Whether content has unconfigured Component/Element nodes. */
	has_unconfigured_tags: boolean;
}
```

Import kinds: `DocsLink`, `Code`, and configured components use `kind: 'default'`. `resolve` from `$app/paths` uses `kind: 'named'`.

### Import Management ✓

Uses `find_import_insert_position` and `generate_import_lines` from `svelte_preprocess_helpers.ts`. Handles both adding new imports (`MdzPrecompiled`, `DocsLink`, `Code`, `resolve`, configured components) and removing the `Mdz` import when safe (see "Import Removal" under MdzPrecompiled Approach).

Three cases for script handling:

1. **Instance script exists** — scan existing imports, dedup by name+path, insert new imports at `find_import_insert_position`
2. **Module-only script** — create new `<script lang="ts">` block after the module script with `s.appendLeft(module_end, ...)`
3. **No script at all** — prepend `<script lang="ts">` with imports

Import dedup checks both name AND source path. Same name from same source = skip (already imported). Same name from different source = skip silently (name collision, falls back to runtime safely).

---

## Edge Cases

### Non-self-closing Mdz

```svelte
// <Mdz content="text"></Mdz> (closing tag, no children) // Handled: replacement range covers start tag
through closing tag
```

The AST `Component` node's `start`/`end` covers both self-closing and open/close forms.

### Empty Content

```svelte
// Input
<Mdz content="" />
// Output -- no children
<Mdz></Mdz>
```

### HTML Entity Decoding

When Svelte parses `content="a &amp; b"`, the AST Text node's `.data` is `"a & b"` (decoded). The preprocessor receives the decoded string. Tested explicitly per fuz_code's pattern.

### Multi-line Content

```svelte
// Input
<Mdz content={`**bold**

_italic_`} />

// Output -- paragraph breaks become separate <p> elements
<Mdz><p><strong>bold</strong></p><p><em>italic</em></p></Mdz>
```

### Single Tag (No Paragraph Wrapper)

The mdz parser skips paragraph wrapping for single component/element tags (MDX convention). The preprocessor preserves this:

```svelte
// Input
<Mdz content="<Alert>text</Alert>" />
// Output -- no <p>, tag rendered directly
<Mdz><Alert>text</Alert></Mdz>
```

### Bare `<` in Text

Escaped to `&lt;` to prevent Svelte template parser confusion.

---

## Testing Strategy

### Unit Tests: mdz_to_svelte ✓

Implemented in `src/test/mdz_to_svelte.test.ts` with 76 tests covering:

- **`escape_svelte_text`** — individual chars, mixed, empty, no-op, sequential replace regression, HTML entities, whitespace
- **`escape_js_string`** — quotes, backslash, newlines, CR, mixed, empty, no-op, backslash-before-quote ordering
- **Node rendering** — each type with exact output matching MdzNodeView.svelte
- **Import tracking** — DocsLink/Code/resolve added correctly, not added when not needed, component imports
- **Edge cases** — empty array, nested formatting, all special chars, single component without `<p>` wrapper

Key test patterns (uses `assert` from vitest per fuz_ui conventions):

````typescript
test('regression: single-pass prevents sequential replace corruption', () => {
	// With sequential .replace(), {foo} would corrupt to {'{'{'}'} foo{'}'}
	assert.equal(escape_svelte_text('{foo}'), "{'{'}foo{'}'}");
});

test('renders inline code as DocsLink with expression syntax', () => {
	const result = mdz_to_svelte(mdz_parse('`some_fn`'), options);
	assert.ok(result.markup.includes("<DocsLink reference={'some_fn'} />"));
	assert.ok(result.imports.has('DocsLink'));
});

test('renders codeblock with null lang', () => {
	const result = mdz_to_svelte(mdz_parse('```\nsome code\n```'), options);
	assert.ok(result.markup.includes('lang={null}'));
});

test('renders fragment link without resolve', () => {
	const result = mdz_to_svelte(mdz_parse('[section](#foo)'), options);
	assert.ok(result.markup.includes("href={'#foo'}"));
	assert.ok(!result.imports.has('resolve'));
});
````

### Integration Tests: svelte_preprocess_mdz ✓

Split across 3 test files with 64 fixtures + 40 behavioral tests:

#### Fixture-based tests: `src/test/svelte_preprocess_mdz.test.ts`

64 fixtures in `src/test/fixtures/svelte_preprocess_mdz/`, each with `input.svelte` and auto-generated `expected.json`. Regenerate with `gro src/test/fixtures/svelte_preprocess_mdz/update` (or `npm run fixtures:update` for all fixture types).

3 test assertions run per fixture set:

1. **Exact output match** — every fixture's preprocessed output equals `expected.json`
2. **Universal parseability** — every fixture's output parses with the Svelte compiler
3. **Source map generation** — at least one fixture produces a valid source map

Fixture categories:

- **Static detection variants** (4) — double-quoted, expression, template literal, concatenation
- **Formatting** (4) — italic, strikethrough, nested bold+italic, nested bold+italic+code
- **Inline code** (2) — basic, special chars (single quote escaping)
- **Links** (6) — external, internal, fragment, query, autolink URL, autolink internal path, link with formatted children, link with special chars in href
- **Block elements** (5) — heading, heading with inline code, horizontal rule, codeblock with lang, codeblock null lang, codeblock special chars, mixed block elements (heading+hr+codeblock+paragraph)
- **Components and elements** (5) — configured component, configured element, multiple components, single component no wrapper, component with formatted children, element with formatted children
- **Edge cases** (7) — empty content, multiline paragraphs, non-self-closing, existing children, special chars braces, special chars `>`, whitespace only
- **Entity decoding** (2) — HTML attribute (Svelte decodes), expression (JS literal, no decode)
- **Props** (3) — preservation (class+inline+nowrap), dynamic expression, shorthand
- **Attribute ordering** (5) — content first/last/middle/only, multiline attributes
- **Multi/mixed** (4) — mixed static+dynamic, multiple static, nested in component, nested in element
- **Svelte control flow** (2) — nested in `{#if}` block, nested in `{#each}` block
- **Imports** (3) — DocsLink+resolve, DocsLink+Code+resolve, multiple different imports across transformations
- **Renamed import** (1) — uses local name (`<Markdown>`) in output tags
- **Import removal** (7) — only import, mixed usages, first/middle/last position, script reference keeps import, template expression keeps import

#### Skip/bail tests: `src/test/svelte_preprocess_mdz.skip.test.ts` (16 tests)

- **Dynamic content preservation** (4) — variable, interpolated template, ternary, function call
- **Spread attributes** (2) — spread only, spread + static content coexist
- **Unconfigured tags** (5) — unconfigured component, unconfigured element, configured+unconfigured in same file, empty config skips, empty config transforms plain markup
- **Missing or wrong imports** (3) — no content attr, no Mdz import, wrong import source, `import type` behavior
- **Excluded files** (2) — regex pattern, string pattern

#### Import management tests: `src/test/svelte_preprocess_mdz.imports.test.ts` (24 tests)

- **Import addition** (5) — DocsLink, Code, resolve, no resolve for fragments, component from config
- **Import deduplication** (3) — existing import, merge across transformations, name collision from different source
- **Script handling** (3) — module-only script creates instance script, instance after module ordering, bail without import string
- **Import resolution** (4) — renamed import, module script block, custom `component_imports`, multiple Mdz aliases in same file
- **Import removal** (9) — all transformed removes Mdz, mixed keeps both, script reference keeps, template expression keeps, MdzPrecompiled collision bails, multiple aliases all removed, partial alias removal, output uses MdzPrecompiled regardless of alias, clean whitespace after removal

---

## Implementation Phases

### Phase 1: mdz_to_svelte + shared helpers ✓

1. ✓ Created `src/lib/mdz_to_svelte.ts`
2. ✓ All node types: Text, Code, Bold, Italic, Strikethrough, Link, Paragraph, Hr, Heading, Codeblock, Element, Component
3. ✓ `escape_svelte_text` — single-pass for `{`, `}`, `<`, `&`
4. ✓ `escape_js_string` — for attribute values in expression syntax
5. ✓ Internal links with `resolve()` and fragment/query detection
6. ✓ Codeblock -> `<Code>` with `lang={null}` support and content escaping
7. ✓ Code -> `<DocsLink reference={'escaped'} />` with expression syntax
8. ✓ Configured Component/Element -> real markup, unconfigured -> `has_unconfigured_tags` flag
9. ✓ Import collection with `kind: 'default' | 'named'`
10. ✓ 76 unit tests in `src/test/mdz_to_svelte.test.ts`
11. ✓ Created `src/lib/svelte_preprocess_helpers.ts` — shared AST utilities extracted from fuz_code's inline implementations
12. ✓ `should_exclude`, `find_attribute`, `evaluate_static_expr`, `extract_static_string` — identical to fuz_code's versions
13. ✓ `resolve_component_names` — import resolution (skips namespace imports)
14. ✓ `find_import_insert_position`, `generate_import_lines` — import management utilities
15. ✓ `PreprocessImportInfo` type — shared import metadata interface
16. ✓ 55 unit tests in `src/test/svelte_preprocess_helpers.test.ts` (expanded to 75 in Phase 3)

**Scope**: 4 new files, moderate complexity

### Phase 2: Preprocessor ✓

1. ✓ Created `src/lib/svelte_preprocess_mdz.ts`
2. ✓ Quick bail-out checks (string inclusion before AST parsing)
3. ✓ Import `resolve_component_names`, `should_exclude`, `find_attribute`, `extract_static_string`, `find_import_insert_position`, `generate_import_lines` from `svelte_preprocess_helpers.ts`
4. ✓ `find_mdz_usages` with AST walking via zimmerframe, static content detection, spread attribute detection, unconfigured tag checking
5. ✓ `build_replacement` — source text slicing preserves all non-content attributes (dynamic expressions, boolean, shorthand)
6. ✓ `add_imports` — import management using shared helpers (add only, default + named, dedup by name+path, name collision detection, no-script and module-only-script cases)
7. ✓ Source maps via `magic-string`
8. ✓ 57 fixture-based tests in `src/test/fixtures/svelte_preprocess_mdz/` (expanded to 64 in Phase 3)
9. ✓ 16 skip/bail tests in `src/test/svelte_preprocess_mdz.skip.test.ts`
10. ✓ 15 import management tests in `src/test/svelte_preprocess_mdz.imports.test.ts` (expanded to 24 in Phase 3)

**Scope**: 1 new file + tests, high complexity

### Phase 3: MdzPrecompiled + Import Removal ✓

1. ✓ Created `src/lib/MdzPrecompiled.svelte` — wrapper component with `children` snippet (not modifying `Mdz.svelte`)
2. ✓ Added `has_identifier_in_tree` to `svelte_preprocess_helpers.ts` — recursive AST walker for identifier references
3. ✓ Enhanced `resolve_component_names` return type from `Set<string>` to `Map<string, ResolvedComponentImport>` with import node references
4. ✓ Added `compiled_component_import` option to `SveltePreprocessMdzOptions`
5. ✓ `build_replacement` outputs `<MdzPrecompiled>` instead of original component name
6. ✓ `find_mdz_usages` tracks total vs transformed usage counts per name
7. ✓ `has_name_collision` check bails if `MdzPrecompiled` already imported from different source
8. ✓ `manage_imports` adds `MdzPrecompiled` import (overwrite strategy avoids MagicString boundary conflicts)
9. ✓ `find_removable_mdz_imports` + `remove_import_declaration` — removes Mdz import when all usages transformed and no identifier references remain
10. ✓ 64 fixture-based tests (57 existing regenerated + 7 new import removal fixtures)
11. ✓ 9 new import removal behavioral tests in `svelte_preprocess_mdz.imports.test.ts`
12. ✓ 20 new unit tests for `has_identifier_in_tree` (pure AST + parsed Svelte AST integration)
13. ✓ Updated cross-test for `<MdzPrecompiled>` tag name and import assertions

**Scope**: 1 new component + preprocessor changes + tests

---

## File Inventory

**New files**:

- `src/lib/svelte_preprocess_mdz.ts` ✓
- `src/lib/svelte_preprocess_helpers.ts` ✓
- `src/lib/mdz_to_svelte.ts` ✓
- `src/test/svelte_preprocess_mdz.fixtures.test.ts` ✓ — fixture-based (64 fixtures)
- `src/test/svelte_preprocess_mdz.skip.test.ts` ✓ — skip/bail conditions (17 tests)
- `src/test/svelte_preprocess_mdz.imports.test.ts` ✓ — import management (24 tests)
- `src/test/svelte_preprocess_mdz.cross.test.ts` ✓ — cross-test: mdz fixtures through preprocessor
- `src/test/svelte_preprocess_helpers.test.ts` ✓
- `src/test/mdz_to_svelte.test.ts` ✓
- `src/lib/MdzPrecompiled.svelte` ✓ — precompiled wrapper component with `children` snippet
- `src/test/fixtures/svelte_preprocess_mdz/` ✓ — 64 fixture directories with `input.svelte` + `expected.json`
- `src/test/fixtures/svelte_preprocess_mdz/svelte_preprocess_mdz_test_helpers.ts` ✓ — shared test helpers
- `src/test/fixtures/svelte_preprocess_mdz/update.task.ts` ✓ — fixture regeneration task
- `src/test/fixtures/svelte_preprocess_mdz/{Wrapper,Foo,Other}.svelte` ✓ — stub components for fixture inputs with relative imports

**Modified files**:

- `src/lib/svelte_preprocess_mdz.ts` ✓ — MdzPrecompiled output, import removal, usage counting
- `src/lib/svelte_preprocess_helpers.ts` ✓ — `has_identifier_in_tree`, enhanced `resolve_component_names`

**Exports** (automatically covered by wildcard `"./*.js"` in package.json):

- `@fuzdev/fuz_ui/svelte_preprocess_mdz.js`
- `@fuzdev/fuz_ui/svelte_preprocess_helpers.js`
- `@fuzdev/fuz_ui/mdz_to_svelte.js`
- `@fuzdev/fuz_ui/MdzPrecompiled.svelte` (via wildcard)

---

## Resolved Questions

1. **Naming**: `svelte_preprocess_mdz` -- matches fuz_code's `svelte_preprocess_fuz_code` pattern.

2. **MdzPrecompiled vs modifying Mdz**: Separate component (`MdzPrecompiled.svelte`) instead of adding `children` prop to `Mdz.svelte`. Avoids breaking API change (`content` staying required). Preprocessor rewrites `<Mdz>` → `<MdzPrecompiled>`, removes unused Mdz import.

3. **Component/element resolution**: Config-based at build time. Unconfigured tags cause the usage to be skipped (runtime fallback).

4. **Codeblocks**: Emit `<Code>` components, chain with `svelte_preprocess_fuz_code`.

5. **Internal links**: Import and use `resolve()` from `$app/paths`. Fragment/query-only links skip resolve.

6. **Security**: Mdz parser limits output to known node types. Text is escaped. No arbitrary Svelte syntax injection.

7. **Default component_imports**: Only `@fuzdev/fuz_ui/Mdz.svelte`. Projects like fuz_ui itself customize via the option.

8. **Shared helpers**: AST utilities (`should_exclude`, `find_attribute`, `evaluate_static_expr`, `extract_static_string`, `resolve_component_names`, `find_import_insert_position`, `generate_import_lines`) extracted to `svelte_preprocess_helpers.ts` rather than inlined in the preprocessor. Enables reuse across preprocessors and independent testing. fuz_code could adopt these in a future refactor.

---

## Open Concerns

### ~~Svelte Text Escaping Verification~~ ✓ Resolved

Verified with 76 unit tests in `src/test/mdz_to_svelte.test.ts`. The single-pass `escape_svelte_text` handles `{`, `}`, `<`, `&` correctly. Regression test confirms sequential `.replace()` corruption is avoided. Tests cover `{#if}`, mixed braces, HTML entities, and empty strings.

### Source Map Accuracy

Verify with browser devtools that:

- Complex transformations (multiple Mdz usages, import additions) map correctly
- Error stack traces point to reasonable locations

### ~~Import Edge Cases~~ ✓ Resolved

- ~~Files with `<script module>` only~~ ✓ Resolved — `add_imports` creates instance `<script lang="ts">` after module script
- ~~Files with no script tag at all~~ ✓ Resolved — `add_imports` prepends `<script lang="ts">`
- ~~Named import for `resolve`~~ ✓ Resolved — `generate_import_lines` groups named imports by path
- ~~Existing `resolve` import (don't duplicate)~~ ✓ Resolved — import dedup checks both name AND source path to detect collisions from different modules
- ~~Namespace imports (`import * as Mdz`)~~ ✓ Resolved — `resolve_component_names` skips `ImportNamespaceSpecifier`

### ~~HTML Entity Decoding Asymmetry~~ ✓ Resolved

Tested explicitly in Phase 2 integration tests (2 tests in "HTML entity decoding asymmetry" describe block):

- `content="a &amp; b"` → extracted value is `"a & b"` (Svelte decodes) → re-escaped to `a &amp; b`
- `content={'a &amp; b'}` → extracted value is `"a &amp; b"` (JS string, no decoding) → double-escaped to `&amp;amp;`

### ~~Attribute Preservation~~ ✓ Resolved

`build_replacement` copies all non-content attributes via source text slicing. Tested in Phase 2 integration tests (4 tests in "attribute ordering", 3 in "prop preservation"):

- Static attributes (`class="foo"`)
- Dynamic expressions (`class={expr}`)
- Boolean attributes (`inline`, `nowrap`)
- Shorthand attributes (`{variable}`)
- Content as first/last/middle/only attribute — all produce correct output

---

## Future Work

### MdzComponent/MdzElement Runtime Helpers

Small Svelte components that resolve component/element names from runtime context (`mdz_components_context`/`mdz_elements_context`). Would enable partial precompilation: static markup (Text, Bold, etc.) rendered at build time, unconfigured components/elements resolved at runtime via helpers. Eliminates the current all-or-nothing behavior per Mdz usage.

### Caching

In-memory content-keyed cache for `mdz_to_svelte` results. Same pattern as fuz_code. Add if profiling shows mdz parsing is a build-time bottleneck.

### Ternary Expression Support

Support `<Mdz content={cond ? 'a' : 'b'} />` by precompiling both branches and emitting a Svelte `{#if}` block:

```svelte
{#if cond}<MdzPrecompiled>rendered_a</MdzPrecompiled>{:else}<MdzPrecompiled>rendered_b</MdzPrecompiled>{/if}
```

fuz_code's `try_extract_conditional` handles this at the attribute level — it preserves the ternary in a single attribute value (`dangerous_raw_html={cond ? highlighted_a : highlighted_b}`). The mdz case is more involved because the preprocessor replaces the entire component with children markup, so the conditional must become an `{#if}` block wrapping two `<MdzPrecompiled>` instances. The `evaluate_static_expr` bindings support means the branch values can also trace through `const` variables (e.g., `content={cond ? label_a : label_b}` where both labels are `const` strings).

### `on_error` Option

`'throw' | 'log'` with CI detection, following fuz_code's `PreprocessFuzCodeOptions.on_error` pattern (`process.env.CI ? 'throw' : 'log'`). Would enable graceful degradation to runtime on parse failures rather than crashing the build. Requires a `handle_error` utility similar to fuz_code's implementation. Should be done before calling the preprocessor "complete".

### Debug/Verbose Logging

Option to log each transformation for development debugging.

### ~~Shared Helpers in fuz_util~~ ✓ Done

Both fuz_ui and fuz_code import from `@fuzdev/fuz_util/svelte_preprocess_helpers.js`. Local copies removed.

### Svelte Mode

Allow Svelte expressions and blocks in mdz content (`{variable}`, `{#if}`, etc.). Requires mdz parser awareness of Svelte syntax. Significant scope increase.

---

## References

- Source of truth: `./src/lib/Mdz.svelte`, `./src/lib/MdzNodeView.svelte`
- Mdz parser: `./src/lib/mdz.ts`
- Mdz contexts: `./src/lib/mdz_components.ts`
- Reference preprocessor: `~/dev/fuz_code/src/lib/svelte_preprocess_fuz_code.ts`
- Reference tests: `~/dev/fuz_code/src/test/svelte_preprocess_fuz_code.test.ts`
- Svelte preprocessing: https://svelte.dev/docs/svelte-compiler#preprocess
- magic-string: https://github.com/rich-harris/magic-string
