# Fuz - Svelte UI library

> friendly user zystem 🧶

Fuz UI is a Svelte UI library built on the Fuz CSS framework and design system. It provides Svelte
components and TypeScript helpers for building user-friendly and
resource-efficient websites.

## Key dependencies

- Svelte 5 - component framework
- SvelteKit - application framework
- Fuz CSS (@fuzdev/fuz_css) - CSS framework and design system foundation
- fuz_util (@fuzdev/fuz_util) - utility library
- Gro (@ryanatkn/gro) - build system and CLI

## Architecture

### Directory structure

```
src/
├── lib/              # exportable library code
│   ├── *.svelte      # UI components
│   ├── *.ts          # TypeScript utilities
│   ├── *.svelte.ts   # Svelte 5 runes and reactive utilities
│   └── *.gen.ts      # Gro genfiles (code generators)
├── test/             # test files (not co-located)
└── routes/           # SvelteKit routes
    ├── docs/         # documentation pages
    │   ├── tomes.ts  # central documentation registry
    │   ├── api/      # auto-generated API docs
    │   └── */        # individual doc pages
    └── *.svelte      # app layout and pages
```

### Core concepts

Tome - documentation units that define the library's structure. Each tome
represents a component or helper with:

- `name` - identifier
- `category` - "guide", "helpers", or "components"
- `component` - the doc page component
- `related` - links to related tomes

Central registry: `src/routes/docs/tomes.ts`

### Identifier namespacing

Fuz uses prefix-based namespacing with functions grouped by domain/object rather
than file location:

```ts
// domain-first, action-last (reads like method calls)
url_github_file(); // url.github_file()
repo_url_parse(); // repo_url.parse()
package_is_published(); // package.is_published()
```

Why: JS's dynamic nature and flat module structure benefit from explicit
prefixes. This pattern:

- groups related functions in autocomplete (`url_*`, `repo_*`, `package_*`)
- prevents name collisions without import aliasing
- works across modules without hierarchical nesting
- maps naturally to `/docs/api` namespace for documentation

Common patterns:

- `domain_action` - object-first, action-last (primary pattern)
- `domain_is_adjective` - boolean checks (`package_is_published`)
- action verbs: `parse`, `create`, `get`, `to`, `analyze`, `extract`
- action prefixes: `url_*` for URL builders

Helper file prefixes (by domain):

- `ts_*` - TypeScript compiler API helpers
- `tsdoc_*` - TSDoc/JSDoc parsing helpers
- `svelte_*` - Svelte component analysis helpers
- `module_*` - module path and detection helpers
- `package_gen_*` - Gro-specific package generation helpers

This naming is consistent across fuz_util, Fuz CSS, and Gro for a unified developer
experience.

Duplicate identifier names across modules fail fast during `gro gen` with clear
error messages. Resolve by renaming one identifier following the `domain_action`
pattern, or add `/** @nodocs */` to exclude from documentation and namespace
validation.

### API documentation system

Fuz includes a comprehensive system for generating and displaying API
documentation:

Code generation flow:

1. `library.gen.ts` (Gro genfile) - analyzes TypeScript/Svelte source with full
   TSDoc support
2. generates `library.json` + `library.ts` - serialized library metadata
   (`package_json` + `source_json`) with typed wrapper using zod validation
3. runtime classes wrap the data with Svelte 5 reactivity:
   - `Library` - library-level API with module/declaration lookups
   - `Module` - represents a source file with its exports
   - `Declaration` - represents an exported declaration (function, type, class,
     component)
4. SvelteKit routes at `/docs/api` render searchable documentation

Two-phase architecture (TSDoc → mdz):

**Build phase** (TSDoc extraction):

- uses `tsdoc_helpers.ts` with TypeScript Compiler API
- extracts JSDoc/TSDoc from source files
- produces structured data (doc_comment, params, returns, throws, examples,
  see_also, mutates)
- runs during `gro gen` only (build-time only)

**Runtime phase** (mdz rendering):

- uses `mdz.ts` to parse and render documentation strings
- mdz is an enhanced markdown dialect
- supports auto-detected URLs (`https://`), internal paths (`/path`), and
  standard markdown links (`[text](url)`)
- TSDoc `@see` tags are converted to mdz format during build phase
- runs in the browser when viewing docs
- mdz is the OUTPUT format - documentation extracted at build time is stored as
  mdz-formatted strings

Supporting helpers (three-layer architecture):

**Low-level** (TypeScript/TSDoc API wrappers):

- `ts_helpers.ts` - TypeScript compiler API utilities
  - `ts_analyze_declaration` - analyze a symbol with full metadata (reusable)
  - `ts_analyze_module_exports` - analyze all exports from a source file (reusable)
  - `ts_create_program` - create TypeScript program with `TsProgramOptions`
  - `ts_extract_*` - lower-level extraction functions for specific constructs
- `tsdoc_helpers.ts` - JSDoc/TSDoc parsing (supports standard tags: `@param`,
  `@returns`, `@throws`, `@example`, `@deprecated`, `@see`, `@since`, `@nodocs`,
  plus non-standard `@mutates` for documenting side effects; `@nodocs` excludes
  declarations from documentation and flat namespace validation)
  - `tsdoc_parse` - extract structured TSDoc from a node
  - `tsdoc_apply_to_declaration` - apply parsed TSDoc to a declaration
- `analysis_context.ts` - diagnostic collection during analysis
  - `AnalysisContext` - accumulates errors/warnings without halting analysis
  - `Diagnostic` types - structured diagnostics with file, line, column
  - `format_diagnostic` - formats diagnostics for display

**Mid-level** (domain utilities):

- `svelte_helpers.ts` - Svelte component analysis (via svelte2tsx)
  - `svelte_analyze_file` - analyze a .svelte file from disk (reusable)
  - `svelte_analyze_component` - analyze from svelte2tsx output
- `module_helpers.ts` - module path utilities and source detection
  - `SourceFileInfo` - build-tool agnostic file info interface
  - `module_matches_source` - configurable source detection predicate
  - `module_is_typescript`, `module_is_svelte` - simple extension predicates
  - `module_extract_path`, `module_get_component_name` - path utilities
  - `module_extract_dependencies` - extract filtered/sorted dependency lists
  - `ModuleSourceOptions`, `MODULE_SOURCE_DEFAULTS` - configuration
- `src_json.ts` - type definitions for the metadata format
- `library_helpers.ts` - URL builders (`url_github_file`, `url_api_declaration`,
  `url_api_module`, etc.)

**High-level** (orchestration):

- `library_gen_helpers.ts` - build-tool agnostic generation helpers
  - `library_gen_collect_source_files` - collect and filter source files
  - `library_gen_extract_dependencies` - extract dependency graph from `SourceFileInfo`
  - `library_gen_find_duplicates` - find duplicate names (returns Map of duplicates)
  - `library_gen_analyze_*` - file analysis wrappers
- `library_gen.ts` - the Gro genfile that orchestrates generation

The reusable functions (`ts_analyze_*`, `svelte_analyze_file`) can be used
outside of package generation for IDE integrations, linters, or custom tools.

Documentation components:

- `DeclarationDetail.svelte` - renders full declaration documentation
- `TypeLink.svelte`, `ModuleLink.svelte`, `DeclarationLink.svelte` -
  cross-reference links
- `Docs*.svelte` - documentation layout system

## Navigation

### Documentation categories

#### Guides

- introduction - overview and getting started
- theming - theme and color scheme system
- api - API documentation structure

#### Helpers

- csp - Content Security Policy utilities (`csp.ts`)
- logos - logo and branding helpers (`logos.ts`)
- mdz - minimal markdown dialect for documentation (`mdz.ts`)

#### Components

layout and structure:

- `Card` - card container component
- `Details` - collapsible details element
- `Breadcrumb` - navigation breadcrumbs

feedback and alerts:

- `Alert` - alert/notification component
- `PendingAnimation` - loading animations
- `PendingButton` - buttons with pending states

overlays and dialogs:

- `Dialog` - modal dialog component
- `Dialogs` - multi-dialog queue manager (experimental)
- `Teleport` - portal/teleport component
- `Contextmenu` - context menu system (`ContextmenuRoot`, `ContextmenuEntry`,
  `ContextmenuLinkEntry`, `ContextmenuSubmenu`, etc.)

forms and inputs:

- `HueInput` - hue color picker
- `ColorSchemeInput` - color scheme selector
- `ThemeInput` - theme selector

icons and media:

- `Svg` - SVG component wrapper
- `Glyph` - emoji/icon display
- `ImgOrSvg` - image/SVG wrapper

clipboard:

- `CopyToClipboard` - clipboard copy button
- `PasteFromClipboard` - clipboard paste functionality

navigation links:

- `Hashlink` - hash anchor links
- `TomeLink`, `DeclarationLink`, `ModuleLink` - docs navigation
- `GithubLink`, `MdnLink` - external reference links

documentation:

- `Docs` - documentation layout system (`Docs*.svelte`)
- `TomeContent`, `TomeHeader`, `TomeSection` - tome layout components
- `PackageDetail` - package information display
- `PackageSummary` - package summary card
- `Mdz` - renders mdz (minimal markdown dialect) content with custom components

utilities:

- `Themed` - theme provider component
- `Redirect` - client-side redirects

### Key library files

core systems:

- `tome.ts` - documentation system types and utilities
- `docs_helpers.svelte.ts` - docs navigation and linking
- `themer.svelte.ts` - theme and color scheme management
- `context_helpers.ts` - Svelte context utilities
- `mdz.ts` - minimal markdown dialect for rendering documentation

component helpers:

- `contextmenu_state.svelte.ts` - context menu state management
- `contextmenu_helpers.ts` - context menu utilities
- `declaration_contextmenu.ts` - contextmenu for code declarations
- `dialog.ts` - dialog utilities
- `alert.ts` - alert utilities

library and API (generated in `src/routes/`):

- `library.json` - generated library metadata (from `library.gen.ts`)
- `library.ts` - typed wrapper with zod validation (from `library.gen.ts`)
- `library.gen.ts` - library metadata generator (Gro genfile)
- `library.svelte.ts` - `Library` class wrapping library data
- `declaration.svelte.ts` - `Declaration` class for code declarations
- `module.svelte.ts` - `Module` class for source files
- `library_helpers.ts` - library URL and parsing utilities

TypeScript and Svelte analysis:

- `ts_helpers.ts` - TypeScript compiler API utilities
  - high-level: `ts_analyze_declaration`, `ts_analyze_module_exports`
  - low-level: `ts_extract_function_info`, `ts_extract_class_info`, etc.
- `svelte_helpers.ts` - Svelte component analysis
  - high-level: `svelte_analyze_file`
  - low-level: `svelte_analyze_component`, `svelte_extract_props`
- `tsdoc_helpers.ts` - TSDoc/JSDoc parsing
  - `tsdoc_parse`, `tsdoc_apply_to_declaration`
- `module_helpers.ts` - module path utilities
  - predicates: `module_matches_source`, `module_is_typescript`, `module_is_svelte`
  - utilities: `module_extract_path`, `module_get_component_name`, `module_extract_dependencies`
  - configuration: `ModuleSourceOptions`, `MODULE_SOURCE_DEFAULTS`
- `library_gen_helpers.ts` - build-tool agnostic generation helpers

browser and DOM:

- `storage.ts` - localStorage utilities
- `intersect.svelte.ts` - Svelte 5 attachment for IntersectionObserver
- `dimensions.svelte.ts` - dimension tracking
- `rune_helpers.svelte.ts` - Svelte 5 rune utilities
- `helpers.ts` - general utilities (`render_value_to_string`)

## Development

### Commands

```bash
npm run dev      # start development server
npm run build    # build library
npm run check    # type check
npm run test     # run tests
```

Or with Gro:

```bash
gro dev          # development
gro build        # build
gro check        # check types
gro test         # test
gro gen          # run code generators
```

IMPORTANT for AI agents: Do NOT run `npm run dev` or `gro dev` - the developer
will manage the dev server. Only run `gro check`, `gro test`, `gro gen`, etc.
for validation and code generation.

### Project standards

- TypeScript - strict typing throughout
- Svelte 5 - uses new runes API
- CSS - plain CSS with Fuz CSS framework and design system
- formatting - Prettier with tabs, 100 char width
- Node - requires >=22.15
- tests - located in `src/test/` (not co-located with source)
  - fixture-based tests in `src/test/fixtures/` (mdz, tsdoc, ts, svelte)
  - each fixture: directory with input file and `expected.json`
  - regenerate with `gro src/test/fixtures/update` (updates all fixture types)
  - IMPORTANT: NEVER manually create or edit `expected.json` files - only create
    input files and run the update task to generate the JSON

### Code style

Fuz uses distinctive naming conventions compared to typical TypeScript/Svelte
projects:

- `snake_case` for most identifiers (files, variables, functions) instead of
  camelCase
- `PascalCase` for types, classes, and Svelte components
- explicit file extensions in all imports
- tab indentation, 100 character line width
- tends toward flat file structure with co-located related code
- JSDoc comments (`/** ... */`) use proper sentence structure with periods;
  inline comments (`//`) can be sentence fragments and should not start with
  capital letters

## Key patterns

### Context system

Uses a standardized context pattern via `context_helpers.ts`:

Core:

- `themer_context` - theme state
- `library_context` - library API metadata

Documentation:

- `tomes_context` - available documentation
- `tome_context` - current documentation page
- `docs_links_context` - documentation navigation links
- `mdz_components_context` - custom mdz components

Contextmenu:

- `contextmenu_context`, `contextmenu_submenu_context`,
  `contextmenu_dimensions_context`

### Theming

Built on Fuz CSS custom properties:

- `Themer` class manages theme state
- `Themed` component provides theme context
- `ColorSchemeInput` and `ThemeInput` for user theme selection
- syncs with localStorage and system preferences

### Documentation system

Fuz provides a comprehensive documentation system for library projects,
combining manual documentation (tomes) with auto-generated API docs.

#### Docs layout and navigation

The `<Docs>` component provides the full documentation layout:

- three-column layout: primary nav (header), secondary nav (sidebar), tertiary
  nav (on-page links)
- responsive: sidebars collapse on mobile
- managed contexts: `tomes_context`, `docs_links_context`

Usage in Fuz:

```svelte
<!-- src/routes/docs/+layout.svelte -->
<script>
	import {Docs} from '@fuzdev/fuz_ui/Docs.svelte';
	import {tomes} from './tomes.js';
	import {library_json} from './library.js';
</script>

<Docs {tomes} {library}>
	{@render children()}
</Docs>
```

For consumer projects (like Fuz CSS):

- same setup, just import your local tomes and library
- optional `breadcrumb_children` snippet for branding

#### Tomes (manual documentation)

Tome system, alternative to "stories" for component docs:

- each doc is a `+page.svelte` wrapping content in `<TomeContent>`
- central registry in `tomes.ts` defines all available docs as data
- each tome has: `name`, `category`, `component`, `related`
- categories: "guide", "helpers", "components"
- `DocsLinks` class manages in-page navigation (tertiary nav)
- related links connect documentation

Creating a tome:

1. **Define in registry**:

   ```typescript
   // src/routes/docs/tomes.ts
   export const tomes: Tome[] = [
   	{
   		name: 'my_component',
   		category: 'components',
   		component: lazy(() => import('./my_component/+page.svelte')),
   		related: ['other_component', 'guide'],
   	},
   ];
   ```

2. **Create page**:

   ```svelte
   <!-- src/routes/docs/my_component/+page.svelte -->
   <script>
   	import {TomeContent} from '@fuzdev/fuz_ui/TomeContent.svelte';
   	import {get_tome_by_name} from '@fuzdev/fuz_ui/tome.js';
   	const tome = get_tome_by_name('my_component');
   </script>

   <TomeContent {tome}>
   	<section>
   		<p>Documentation content...</p>
   	</section>
   </TomeContent>
   ```

#### API documentation (auto-generated)

Auto-generated documentation from TypeScript/Svelte source with full TSDoc
support.

Setup for consumer projects (opt-in):

1. **Setup generation**:

   ```typescript
   // src/routes/library.gen.ts
   export * from '@fuzdev/fuz_ui/library.gen.js';
   ```

2. **Create API index route**:

   ```svelte
   <!-- src/routes/docs/api/+page.svelte -->
   <script>
   	import {ApiIndex} from '@fuzdev/fuz_ui/ApiIndex.svelte';
   </script>

   <ApiIndex />
   ```

3. **Create module detail route**:

   ```svelte
   <!-- src/routes/docs/api/[...module_path]/+page.svelte -->
   <script>
   	import {ApiModule} from '@fuzdev/fuz_ui/ApiModule.svelte';
   	const {params} = $props();
   </script>

   <ApiModule module_path={params.module_path} />
   ```

4. **Run generator**: `gro gen` to create `library.json`

Composable building blocks (for custom layouts):

- `api_search.svelte.ts` - search/filter state management
  - `create_declaration_search(library)` - for API index
  - `create_module_declaration_search(declarations)` - for module pages
- `ApiDeclarationList.svelte` - renders filtered declaration list
- `DocsSearch.svelte` - search input UI
- use with `TomeContent`, `TomeSection`, etc. for custom composition

## Notes

- early alpha - API will change
- designed for author's projects, gradually expanding
- copy/paste friendly for customization
- some components require SvelteKit (needs review)
- not enterprise-ready, growing as needed
