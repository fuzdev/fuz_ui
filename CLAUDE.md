# fuz_ui

> friendly user zystem - Svelte UI library

fuz_ui (`@fuzdev/fuz_ui`) is a Svelte UI library built on fuz_css. It provides
components and TypeScript helpers for building user-friendly websites.

For coding conventions, see [`fuz-stack`](../fuz-stack/CLAUDE.md).

## Gro commands

```bash
gro check     # typecheck, test, lint, format check (run before committing)
gro typecheck # typecheck only (faster iteration)
gro test      # run tests with vitest
gro gen       # regenerate .gen files (library.json, fuz.css)
gro build     # build for production
```

IMPORTANT for AI agents: Do NOT run `gro dev` - the developer will manage the
dev server.

## Key dependencies

- Svelte 5 - component framework
- SvelteKit - application framework
- fuz_css (@fuzdev/fuz_css) - CSS framework and design system foundation
- fuz_util (@fuzdev/fuz_util) - utility library
- Gro (@fuzdev/gro) - build system and CLI

## Scope

fuz_ui is a **Svelte 5 UI component library**:

- UI components (dialogs, menus, forms, layout)
- Documentation system (tomes + auto-generated API docs)
- Source code analysis (TypeScript/Svelte introspection)
- Theme management integration with fuz_css

### What fuz_ui does NOT include

- CSS framework (use fuz_css)
- Pure utility functions (use fuz_util)
- Build tooling (use gro)
- State management beyond contexts
- Router or navigation (use SvelteKit)

## Architecture

### Directory structure

```
src/
├── lib/              # exportable library code
│   ├── *.svelte      # UI components (50+)
│   ├── *.ts          # TypeScript utilities
│   ├── *.svelte.ts   # Svelte 5 runes and reactive utilities
│   └── *.gen.ts      # Gro genfiles (code generators)
├── test/             # test files (not co-located)
│   └── fixtures/     # fixture-based tests (mdz, tsdoc, ts, svelte)
└── routes/           # SvelteKit routes
    ├── docs/         # documentation pages
    │   ├── tomes.ts  # central documentation registry
    │   └── api/      # auto-generated API docs
    └── library.gen.ts # library metadata generator
```

### Core concepts

**Tome** - documentation units that define the library's structure. Each tome
represents a component or helper with `name`, `category`, `component`, and
`related` fields. Central registry: `src/routes/docs/tomes.ts`

**Identifier namespacing** - fuz_ui uses domain-prefix naming for its helper
clusters. See `fuz-stack` for the full naming conventions.

Helper file prefixes: `ts_*` (TypeScript API), `tsdoc_*` (JSDoc parsing),
`svelte_*` (component analysis), `module_*` (path utilities),
`package_gen_*` (Gro package generation).

## Components

### Layout and structure

- `Card`, `Details`, `Breadcrumb`, `Teleport`
- `Docs`, `DocsContent`, `DocsList`, `DocsMenu` - documentation layout
- `TomeContent`, `TomeHeader`, `TomeSection` - tome layout

### Feedback and alerts

- `Alert` - alert/notification component
- `PendingAnimation`, `PendingButton` - loading states

### Overlays and dialogs

- `Dialog`, `Dialogs` - modal dialogs
- `Contextmenu*` - context menu system (Root, Entry, LinkEntry, TextEntry,
  Submenu, Separator)

### Forms and inputs

- `HueInput`, `ColorSchemeInput`, `ThemeInput` - theme controls

### Icons and media

- `Svg`, `Glyph`, `ImgOrSvg`

### Clipboard

- `CopyToClipboard`, `PasteFromClipboard`

### Navigation links

- `Hashlink` - hash anchor links
- `TomeLink`, `DeclarationLink`, `ModuleLink` - docs navigation
- `GithubLink`, `MdnLink` - external reference links

### Documentation

- `PackageDetail`, `PackageSummary` - package info display
- `Mdz` - renders mdz (minimal markdown dialect) content
- `ApiIndex`, `ApiModule`, `ApiDeclarationList` - API documentation

### Utilities

- `Themed` - theme provider component
- `Redirect` - client-side redirects

## Key library files

### Core systems

- `tome.ts` - documentation system types and utilities
- `themer.svelte.ts` - theme and color scheme management (Themer class)
- `context_helpers.ts` - Svelte context utilities (`create_context()`)
- `mdz.ts` - minimal markdown dialect parser and renderer

### Component helpers

- `contextmenu_state.svelte.ts` - context menu state management
- `dialog.ts` - dialog utilities (`to_dialog_params()`, DialogLayout enum)
- `alert.ts` - alert utilities
- `storage.ts` - localStorage utilities with optional `parse_fn` for custom parsing
- `csp.ts` - Content Security Policy builder utilities
- `dimensions.svelte.ts` - `Dimensions` class for width/height tracking
- `rune_helpers.svelte.ts` - `effect_with_count()` wrapper

### Library and API generation

- `library.gen.ts` - Gro genfile that orchestrates metadata generation
- `library.svelte.ts` - `Library` class wrapping library data
- `declaration.svelte.ts` - `Declaration` class for code declarations
- `module.svelte.ts` - `Module` class for source files
- `library_helpers.ts` - docs URL helpers
- `vite_plugin_library_well_known.ts` - RFC 8615 `.well-known/` metadata publishing

### TypeScript and Svelte analysis

- `ts_helpers.ts` - TypeScript compiler API utilities (`ts_analyze_declaration`,
  `ts_analyze_module_exports`, `ts_create_program`)
- `svelte_helpers.ts` - Svelte component analysis (`svelte_analyze_file`,
  `svelte_analyze_component`)
- `tsdoc_helpers.ts` - JSDoc/TSDoc parsing (`tsdoc_parse`,
  `tsdoc_apply_to_declaration`). Supports `@param`, `@returns`, `@throws`,
  `@example`, `@deprecated`, `@see`, `@since`, `@nodocs`, `@mutates`
- `module_helpers.ts` - module path utilities (`module_is_typescript`,
  `module_is_svelte`, `module_extract_path`)
- `library_analysis.ts` - unified analysis entry point
- `library_pipeline.ts` - pipeline orchestration (collect, analyze, validate,
  transform, output)

### Browser and DOM

- `docs_helpers.svelte.ts` - docs navigation and linking (DocsLinks class)
- `intersect.svelte.ts` - Svelte 5 attachment for IntersectionObserver
- `helpers.ts` - general utilities (`render_value_to_string`)

### Preprocessor

- `svelte_preprocess_mdz.ts` - build-time compilation of static `Mdz` content
- `mdz_to_svelte.ts` - converts `MdzNode` arrays to Svelte markup strings
- `MdzPrecompiled.svelte` - wrapper component for precompiled output

## Preprocessor: svelte_preprocess_mdz

Compiles static `<Mdz content="...">` usages to pre-rendered Svelte markup at
build time, replacing `Mdz` with `MdzPrecompiled` containing children.
Eliminates runtime mdz parsing for known-static content.

### Setup

```js
// svelte.config.js
import {svelte_preprocess_mdz} from '@fuzdev/fuz_ui/svelte_preprocess_mdz.js';

export default {
	preprocess: [
		svelte_preprocess_mdz({
			components: {Alert: '$lib/Alert.svelte'},
			elements: ['aside', 'details'],
		}),
		// ...other preprocessors
	],
};
```

### Options

- `exclude` — file patterns to skip (`Array<string | RegExp>`)
- `components` — mdz component name to import path mapping (`Record<string, string>`)
- `elements` — allowed HTML element names in mdz content (`Array<string>`)
- `component_imports` — import sources that resolve to Mdz (default: `['@fuzdev/fuz_ui/Mdz.svelte']`)
- `compiled_component_import` — import path for MdzPrecompiled (default: `'@fuzdev/fuz_ui/MdzPrecompiled.svelte'`)
- `on_error` — `'log'` or `'throw'` (default: `'throw'` in CI, `'log'` otherwise)

### Skip conditions

The preprocessor leaves `Mdz` untouched (falls back to runtime) when:

- File is excluded via `exclude` option
- No matching import source found for Mdz
- `import type` declaration (not a runtime import)
- `MdzPrecompiled` name already imported from a different source
- `content` prop is dynamic (variable, function call, `$state`, `$derived`)
- Spread attributes present (`{...props}`)
- Content references unconfigured components or elements
- A ternary branch has dynamic content or unconfigured tags

### What gets transformed

- Static string attributes: `content="**bold**"`
- JS string expressions: `content={'**bold**'}`
- Template literals without interpolation: ``content={`**bold**`}``
- Const variable references: `const msg = '**bold**'; content={msg}`
- Ternary chains with static branches: `content={show ? '**a**' : '**b**'}`
- Nested ternaries: `content={a ? 'x' : b ? 'y' : 'z'}` → `{#if}/{:else if}/{:else}`

### Import management

The preprocessor automatically:

- Adds `MdzPrecompiled` import
- Adds imports required by rendered content (`DocsLink`, `Code`, `resolve`, configured components)
- Removes the `Mdz` import when all usages are transformed and the identifier is not referenced elsewhere
- Removes dead `const` bindings that were only consumed by transformed content

## Context system

All contexts use the standardized pattern via `context_helpers.ts`:

**Core:**

- `themer_context` - theme state (Themer class)
- `library_context` - library API metadata (Library class)

**Documentation:**

- `tomes_context` - available documentation (Map<string, Tome>)
- `tome_context` - current documentation page (Tome)
- `docs_links_context` - documentation navigation (DocsLinks class)
- `mdz_components_context` - custom mdz components

**Contextmenu:**

- `contextmenu_context` - context menu state
- `contextmenu_submenu_context` - submenu state
- `contextmenu_dimensions_context` - positioning

**Other:**

- `selected_variable_context` - style variable selection

## Documentation system

Fuz provides a documentation system combining manual tomes with auto-generated
API docs.

**Tomes** - manual documentation pages. Define in `tomes.ts`, create matching
`+page.svelte` wrapping content in `<TomeContent>`. Categories: "guide",
"helpers", "components". See `src/routes/docs/tomes.ts` for examples.

**API documentation** - auto-generated from TypeScript/Svelte source with full
TSDoc support. Two-phase architecture: TSDoc extraction at build time
(`tsdoc_helpers.ts`), mdz rendering at runtime (`mdz.ts`). Setup requires
`library.gen.ts` and API routes. See `src/routes/docs/api/` for example routes.

**Docs layout** - `<Docs>` provides three-column responsive layout with managed
contexts for navigation.

## Known limitations

- **Early alpha** - API will change
- **SvelteKit dependency** - Some components require SvelteKit
- **Fixture tests** - Never manually edit `expected.json` files; create inputs
  and run `gro src/test/fixtures/update` to regenerate
- **Contextmenu focus** - APG-compliant focus management not yet implemented
- **Color optimization** - Build-time color optimization not implemented

## Project standards

- TypeScript strict mode
- Svelte 5 with runes API
- Prettier with tabs, 100 char width
- Node >= 22.15
- Tests in `src/test/` (not co-located)
- Fixture-based tests: input file + `expected.json`, regenerate with
  `gro src/test/fixtures/update`

### Code style

- `snake_case` for files, variables, functions
- `PascalCase` for types, classes, Svelte components
- Explicit file extensions in imports
- JSDoc comments use proper sentences with periods; inline comments can be
  fragments without capitals

## Related projects

- [`fuz_css`](../fuz_css/CLAUDE.md) - CSS framework (peer dependency)
- [`fuz_util`](../fuz_util/CLAUDE.md) - utility functions (peer dependency)
- [`fuz_template`](../fuz_template/CLAUDE.md) - starter template using fuz_ui
- [`fuz_blog`](../fuz_blog/CLAUDE.md) - blog template using fuz_ui
- [`fuz_mastodon`](../fuz_mastodon/CLAUDE.md) - Mastodon components using fuz_ui
