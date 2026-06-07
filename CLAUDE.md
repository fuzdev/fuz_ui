# fuz_ui

> friendly user zystem - Svelte UI library

fuz_ui (`@fuzdev/fuz_ui`) is a Svelte UI library built on fuz_css. It provides
components and TypeScript helpers for building user-friendly websites.

For coding conventions, see Skill(fuz-stack).

## Committing

`git add` and `git commit` are denied by `.claude/settings.local.json` in
this repo — make the edits and stop, the user commits.

## Gro commands

```bash
gro check     # typecheck, test, lint, format check (run before committing)
gro typecheck # typecheck only (faster iteration)
gro test      # run tests with vitest
gro build     # build for production
```

IMPORTANT for AI agents: Do NOT run `gro dev` - the developer will manage the
dev server.

## Benchmarks

```bash
npm run benchmark         # run mdz parser benchmarks, compare against baseline
npm run benchmark:save    # save current results as the new baseline
npm run benchmark:clean   # remove the local baseline (forces a fresh seed)
```

Baseline lives at `src/benchmarks/baseline.json` and is **gitignored** —
local-only. After a fuz_util upgrade that bumps the baseline schema version,
the next run auto-deletes the stale file with a warning; `--save` re-seeds.

## Key dependencies

- Svelte 5 - component framework
- SvelteKit - application framework
- fuz_css (@fuzdev/fuz_css) - CSS framework and design system foundation
- fuz_util (@fuzdev/fuz_util) - utility library
- svelte-docinfo (svelte-docinfo) - TypeScript/Svelte static analysis
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
│   └── *.svelte.ts   # Svelte 5 runes and reactive utilities
├── test/             # test files (not co-located)
│   └── fixtures/     # fixture-based tests (mdz, tsdoc, ts, svelte)
└── routes/           # SvelteKit routes
    └── docs/         # documentation pages
        ├── tomes.ts  # central documentation registry
        └── api/      # auto-generated API docs
```

### Core concepts

**Tome** - documentation units that define the library's structure. Each tome
represents a component or helper with `name`, `category`, `component`, and
`related` fields. Central registry: `src/routes/docs/tomes.ts`

**svelte-docinfo** - TypeScript/Svelte static analysis is provided by the
`svelte-docinfo` package. The analyzed modules arrive at runtime via the
Vite plugin's `virtual:svelte-docinfo` module. fuz_ui consumes source
utilities (`isTypescript`, `isSvelte`, `isCss`, `isJson` from `source.js`),
types (`ModuleJson`, `DeclarationJson` from `types.js`), and declaration
helpers (`generateImport`, `getDisplayName` from `declaration-helpers.js`).

## Components

### Layout and structure

- `Card`, `Details`, `Breadcrumb`, `Teleport`
- `Docs`, `DocsContent`, `DocsList`, `DocsMenu` - documentation layout
- `TomeContent`, `TomeHeader`, `TomeSection` - tome layout

### Feedback and alerts

- `Alert` - alert/notification component
- `PendingAnimation`, `PendingButton` - loading states

### Overlays and dialogs

- `Dialog`, `DialogContent` - native `<dialog>` modal and its default content surface
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
- `ProjectLinks` - @fuzdev ecosystem package grid; add an entry inline and a matching logo in `logos.ts`

### Documentation

- `LibraryDetail`, `LibrarySummary` - library info display (from a `Library`)
- `Mdz` - renders mdz (minimal markdown dialect) content
- `MdzStream`, `MdzStreamNodeView` - streaming mdz renderer (opcode-driven)
- `MdzRoot` - context provider for mdz (base, components, elements)
- `ApiIndex`, `ApiModule`, `ApiDeclarationList` - API documentation

### Utilities

- `ThemeRoot` - theme provider component
- `Redirect` - client-side redirects

## Key library files

### Core systems

- `tome.ts` - documentation system types and utilities
- `theme_state.svelte.ts` - theme and color scheme management (ThemeState class)
- `context_helpers.ts` - Svelte context utilities (`create_context()`)
- `mdz.ts` - minimal markdown dialect parser and renderer
- `mdz_stream_parser.ts` - streaming opcode parser (`MdzStreamParser`)
- `mdz_opcodes.ts` - opcode type definitions for streaming parser
- `mdz_opcodes_to_nodes.ts` - opcode-to-MdzNode tree bridge
- `mdz_stream_state.svelte.ts` - reactive Svelte 5 state (`MdzStreamState`)

### Component helpers

- `contextmenu_state.svelte.ts` - context menu state management
- `dialog.ts` - dialog types and `dialog_context` (`DialogContext`, `DialogLayout`)
- `alert.ts` - alert utilities
- `storage.ts` - localStorage utilities with optional `parse_fn` for custom parsing
- `csp.ts` - Content Security Policy builder utilities
- `dimensions.svelte.ts` - `Dimensions` class for width/height tracking
- `rune_helpers.svelte.ts` - `effect_with_count()` wrapper

### Library and API generation

Library metadata is built at runtime from two virtual modules. The
`svelte-docinfo` Vite plugin (`svelte-docinfo/vite.js`, wired in
`vite.config.ts`) exposes the analyzed modules through
`virtual:svelte-docinfo`, and `vite_plugin_pkg_json` exposes the curated,
publish-safe `package.json` subset through `virtual:pkg.json`. The app's
`src/routes/library.ts` combines them via `library_json_from_modules` (from
`@fuzdev/fuz_util/library_json.js`) to construct the `LibraryJson`;
`+layout.svelte` separately uses `virtual:pkg.json` for `SiteState`.

The served `pkg_json` field set defaults to `pkg_json_keys`. To widen it, pass
a `keys` list to both `vite_plugin_pkg_json` (build-time strip) and
`library_json_from_modules` (runtime re-strip) — they must match or the runtime
re-strip drops the extras. See the `vite_plugin_pkg_json` tome for the pattern.

- `vite_plugin_pkg_json.ts` - Vite plugin serving `virtual:pkg.json` (curated
  `PkgJson` from `@fuzdev/fuz_util/pkg_json.js`)
- `library.svelte.ts` - `Library` class wrapping library data
- `declaration.svelte.ts` - `Declaration` class for code declarations (uses
  `generateImport`, `getDisplayName` from `svelte-docinfo/declaration-helpers.js`)
- `module.svelte.ts` - `Module` class for source files (uses `ModuleJson` from
  `svelte-docinfo/types.js`)
- `LibraryDetail.svelte` - library overview component (uses `isTypescript`,
  `isSvelte`, `isCss`, `isJson` from `svelte-docinfo/source.js`)
- `library_helpers.ts` - docs URL helpers

Analysis is provided by `svelte-docinfo`. See its CLAUDE.md for the
full API. Key imports used by fuz_ui:

- `source.js` — type predicates: `isTypescript`, `isSvelte`, `isCss`,
  `isJson`
- `types.js` — `ModuleJson`, `DeclarationJson` (and their `*Input` variants)
- `declaration-helpers.js` — `generateImport`, `getDisplayName`

### Browser and DOM

- `docs_helpers.svelte.ts` - docs navigation and linking (DocsLinks class)
- `autofocus.svelte.ts` - Svelte 5 attachment for focusing elements on mount
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
- `base` prop is dynamic (falls back to runtime for correct resolution)
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

- `theme_state_context` - theme state (ThemeState class)
- `library_context` - library API metadata (Library class)

**Documentation:**

- `tomes_context` - available documentation (Map<string, Tome>)
- `tome_context` - current documentation page (Tome)
- `docs_links_context` - documentation navigation (DocsLinks class)
- `mdz_components_context` - custom mdz components (getter)
- `mdz_elements_context` - allowed HTML elements (getter)
- `mdz_base_context` - base path for relative link resolution (getter)

All three use getter pattern (`() => value | undefined`). Set via `MdzRoot` component
or directly with `context.set(() => value)`.

**Contextmenu:**

- `contextmenu_context` - context menu state
- `contextmenu_submenu_context` - submenu state
- `contextmenu_dimensions_context` - positioning

**Other:**

- `selected_variable_context` - style variable selection
- `site_context` - light site identity (`SiteState`: icon, glyph, repo_url) for app
  chrome like `Breadcrumb` and `DocsFooter`; set once at the root layout. Distinct
  from `library_context`, which carries the heavy module/declaration metadata

## Documentation system

Fuz provides a documentation system combining manual tomes with auto-generated
API docs.

**Tomes** - manual documentation pages. Define in `tomes.ts`, create matching
`+page.svelte` wrapping content in `<TomeContent>`. Categories: "guide",
"helpers", "components". See `src/routes/docs/tomes.ts` for examples.

**API documentation** - auto-generated from TypeScript/Svelte source with full
TSDoc support. Two-phase architecture: TSDoc extraction at build time
(via `svelte-docinfo`), mdz rendering at runtime (`mdz.ts`). Setup
requires the `svelte-docinfo` Vite plugin (which exposes
`virtual:svelte-docinfo`) and API routes. See `src/routes/docs/api/` for
example routes.

**Docs layout** - `<Docs>` provides three-column responsive layout with managed
contexts for navigation.

## Known limitations

- **Early alpha** - API will change
- **SvelteKit dependency** - Some components require SvelteKit
- **Fixture tests** - Never manually edit `expected.json` (see Fixture tests
  section below)
- **Contextmenu focus** - APG-compliant focus management not yet implemented
- **Color optimization** - Build-time color optimization not implemented

## Project standards

- TypeScript strict mode
- Svelte 5 with runes API
- Prettier with tabs, 100 char width
- Node >= 22.15
- Tests in `src/test/` (not co-located)
- Fixture-based tests (see below)

### Code style

- `snake_case` for files, variables, functions
- `PascalCase` for types, classes, Svelte components
- Explicit file extensions in imports
- JSDoc comments use proper sentences with periods; inline comments can be
  fragments without capitals

## Fixture tests

Fixture-based tests compare parser/analyzer output against expected JSON.
Each fixture is a directory with an input file and `expected.json`.

**Never manually edit `expected.json`** — create or modify input files and
regenerate with update tasks.

### Fixture categories

| Category                          | Input file     | Tests                               |
| --------------------------------- | -------------- | ----------------------------------- |
| `fixtures/mdz/`                   | `input.mdz`    | mdz parser (`mdz_parse`)            |
| `fixtures/tsdoc/`                 | `input.ts`     | TSDoc/JSDoc parsing (`tsdoc_parse`) |
| `fixtures/ts/`                    | `input.ts`     | TypeScript declaration analysis     |
| `fixtures/svelte/`                | `input.svelte` | Svelte component analysis           |
| `fixtures/svelte_preprocess_mdz/` | `input.svelte` | mdz preprocessor transforms         |

### Regenerating fixtures

```bash
gro src/test/fixtures/update                        # all categories
gro src/test/fixtures/mdz/update                    # mdz only
gro src/test/fixtures/svelte_preprocess_mdz/update  # preprocessor only
gro src/test/fixtures/tsdoc/update                  # tsdoc only
gro src/test/fixtures/ts/update                     # ts only
gro src/test/fixtures/svelte/update                 # svelte only
```

### Adding a fixture

1. Create a new directory under the appropriate category (e.g.
   `fixtures/mdz/my_new_case/`)
2. Add the input file (`input.mdz`, `input.ts`, or `input.svelte`)
3. Run the category's update task to generate `expected.json`
4. Run `gro test` to verify

For `svelte_preprocess_mdz` fixtures, input files with fake imports need
`// @ts-nocheck` in the script block.

## Related projects

- [`fuz_css`](../fuz_css/CLAUDE.md) - CSS framework (peer dependency)
- [`fuz_util`](../fuz_util/CLAUDE.md) - utility functions (peer dependency)
- [`svelte-docinfo`](../svelte-docinfo/CLAUDE.md) - TypeScript/Svelte static analysis (dependency)
- [`fuz_template`](../fuz_template/CLAUDE.md) - starter template using fuz_ui
- [`fuz_blog`](../fuz_blog/CLAUDE.md) - blog template using fuz_ui
- [`fuz_mastodon`](../fuz_mastodon/CLAUDE.md) - Mastodon components using fuz_ui
