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

## Key dependencies

- Svelte 5 - component framework
- SvelteKit - application framework
- fuz_css (@fuzdev/fuz_css) - CSS framework and design system foundation
- fuz_util (@fuzdev/fuz_util) - utility library
- mdz (@fuzdev/mdz) - markdown dialect (parser, renderer, preprocessor) rendered
  throughout the docs; `DocsLink` (inline code) and fuz_code's `Code` (code
  blocks) are injected into its rendering seam (optional peer)
- fuz_code (@fuzdev/fuz_code) - syntax highlighting; provides the `Code`
  injected into mdz code blocks (optional peer)
- svelte-docinfo (svelte-docinfo) - TypeScript/Svelte static analysis (dev
  dependency; types + a few runtime helpers), plus a Vite plugin exposing the
  analyzed modules via `virtual:svelte-docinfo`
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
Vite plugin's `virtual:svelte-docinfo` module. The specific imports fuz_ui
consumes are listed under [Library and API generation](#library-and-api-generation).

## Components

### Layout and structure

- `Card`, `Details`, `Breadcrumb`, `Teleport`

(Docs-system layout and tome components are cataloged under
[Documentation & API system](#documentation--api-system).)

### Feedback and alerts

- `Alert` - alert/notification component
- `PendingAnimation`, `PendingButton` - loading states

### Overlays and dialogs

- `Dialog`, `DialogContent` - native `<dialog>` modal and its default content surface
- `Contextmenu*` - context menu system (Root, Menu, Entry, LinkEntry, TextEntry,
  Submenu, Separator, Icon); `ContextmenuMenu` is the open-menu surface shared by
  the two roots, which own gesture detection, and `ContextmenuIcon` renders the
  shared `icon` prop (string, `SvgData`, or snippet)

### Forms and inputs

- `HueInput`, `ColorSchemeInput`, `ThemeInput` - theme controls

### Icons and media

- `Svg`, `Glyph`, `ImgOrSvg`

### Clipboard

- `CopyToClipboard`, `PasteFromClipboard`

### Navigation links

- `Hashlink` - hash anchor links
- `GithubLink`, `MdnLink` - external reference links
- `ProjectLinks` - @fuzdev ecosystem package grid; add an entry inline and a matching logo in `logos.ts`

### Documentation & API system

The complete docs-component catalog. Consumers import only a handful when
adopting the docs system — the fuz-stack skill's documentation-system reference
lists that adoption subset; the full set below is fuz_ui inventory. API
components render TSDoc prose as mdz via `@fuzdev/mdz`, injecting `DocsLink`
(inline code) and fuz_code's `Code` (code blocks).

Docs layout:

- `Docs` — three-column layout; sets `tomes_context` + `docs_links_context`
- `DocsPrimaryNav` — top bar with breadcrumb and menu toggle
- `DocsSecondaryNav` — left sidebar; tome list grouped by category
- `DocsTertiaryNav` — right sidebar; section headers within the current page
- `DocsContent` — content wrapper for docs pages
- `DocsFooter` — footer with library info and breadcrumb
- `DocsSearch` — search input for filtering modules and declarations
- `DocsMenu` — navigation menu for tomes
- `DocsLink` — docs navigation link; also mdz's injected inline-code renderer
- `DocsList` — list component for docs navigation
- `DocsPageLinks` — links section within a docs page
- `DocsMenuHeader` — header within the docs navigation menu

Tome:

- `TomeContent` — individual tome page wrapper; sets `tome_context`
- `TomeHeader` — default header rendered by `TomeContent`
- `TomeSection` — section container with depth tracking + intersection
- `TomeSectionHeader` — section heading with hashlink (auto h2/h3/h4)
- `TomeLink` — cross-reference link to another tome

API:

- `ApiIndex` — API overview with search; lists all modules and declarations
- `ApiModule` — single module's declarations with full detail
- `ApiModulesList` — module listing within the API index
- `ApiDeclarationList` — declaration listing within a module
- `DeclarationDetail` — full detail view of a single declaration
- `DeclarationLink` — link to a declaration in API docs
- `ModuleLink` — link to a module in API docs
- `TypeLink` — link to a type reference

Library metadata:

- `LibrarySummary` — compact package metadata card
- `LibraryDetail` — expanded package info with file-type breakdown (from a `Library`)

mdz itself (`Mdz`, `MdzRoot`, `MdzStream`, the preprocessor) lives in `@fuzdev/mdz`.

### Utilities

- `ThemeRoot` - theme provider component
- `Redirect` - client-side redirects

## Key library files

### Core systems

- `tome.ts` - documentation system types and utilities
- `theme_state.svelte.ts` - theme and color scheme management (ThemeState class)
- `context_helpers.ts` - Svelte context utilities (`create_context()`)

### Component helpers

- `contextmenu_state.svelte.ts` - context menu state management
- `dialog.ts` - dialog types and `dialog_context` (`DialogContext`, `DialogAlign`,
  `DialogCloseButtonAttrs`)
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
`@fuzdev/fuz_util/library_json.ts`) to construct the `LibraryJson`;
`+layout.svelte` separately uses `virtual:pkg.json` for `SiteState`.

The served `pkg_json` field set defaults to `pkg_json_keys`. To widen it, pass
a `keys` list to both `vite_plugin_pkg_json` (build-time strip) and
`library_json_from_modules` (runtime re-strip) — they must match or the runtime
re-strip drops the extras. See the `vite_plugin_pkg_json` tome for the pattern.

- `vite_plugin_pkg_json.ts` - Vite plugin serving `virtual:pkg.json` (curated
  `PkgJson` from `@fuzdev/fuz_util/pkg_json.ts`)
- `vite_plugin_docs_mdz.ts` - Vite plugin that pre-parses svelte-docinfo's
  markdown fields to `MdzNode` trees (`*Nodes` siblings on `virtual:svelte-docinfo`),
  so API-docs pages render pre-parsed instead of parsing per `<Mdz>` mount (see
  [mdz rendering](#mdz-rendering))
- `library.svelte.ts` - `Library` class wrapping library data
- `declaration.svelte.ts` - `Declaration` class for code declarations (uses
  `generateImport`, `getDisplayName` from `svelte-docinfo/declaration-helpers.js`)
- `module.svelte.ts` - `Module` class for source files (uses `ModuleJson` from
  `svelte-docinfo/types.js`)
- `LibraryDetail.svelte` - library overview component (uses `isTypescript`,
  `isSvelte`, `isCss`, `isJson` from `svelte-docinfo/source.js`)
- `library_helpers.ts` - docs URL helpers

The `svelte-docinfo` imports above resolve to its `source.js` (type
predicates), `types.js` (`ModuleJson`, `DeclarationJson`, and their `*Input`
variants), and `declaration-helpers.js` (`generateImport`, `getDisplayName`);
see its CLAUDE.md for the full API.

### Browser and DOM

- `docs_helpers.svelte.ts` - docs navigation and linking (DocsLinks class)
- `autofocus.svelte.ts` - Svelte 5 attachment for focusing elements on mount
- `intersect.svelte.ts` - Svelte 5 attachment for IntersectionObserver
- `helpers.ts` - general utilities (`render_value_to_string`)

## mdz rendering

mdz (parser, renderer, streaming, and the `svelte_preprocess_mdz` build-time
preprocessor) lives in `@fuzdev/mdz` — see its CLAUDE.md. fuz_ui consumes it to
render TSDoc prose, wiring the rendering seam so inline code links API identifiers
(`DocsLink`) and code blocks get syntax highlighting (fuz_code `Code`).

All of fuz_ui's mdz is dynamic TSDoc prose, so the injection happens at **runtime**:
`ApiModule` / `DeclarationDetail` set `mdz_code_context` / `mdz_codeblock_context`
(via `mdz_set_context_with_fallback`) before rendering `<Mdz>`. The plain
`svelte_preprocess_mdz()` in `svelte.config.js` is the standard ecosystem
preprocessor (it precompiles any static `<Mdz>` content to plain markup); fuz_ui
authors no static mdz, so it's effectively a pass-through and needs no injection
options.

The markdown **parsing** (not rendering) is moved to build time by
`vite_plugin_docs_mdz`: it pre-parses svelte-docinfo's markdown fields
(`docComment`, `description`, `returnDescription`, `moduleComment`, `examples`,
`seeAlso`) to `MdzNode` trees and adds them as `*Nodes` siblings, which the
`DocMdz` wrapper prefers (`<Mdz nodes={…}>`), falling back to parsing the raw
string when the plugin didn't run. Rendering and the injection seam above stay
at runtime; only the parse moves. Requires the `nodes` prop from `@fuzdev/mdz`.

## Context system

All contexts use the standardized pattern via `context_helpers.ts`:

**Core:**

- `theme_state_context` - theme state (ThemeState class)
- `library_context` - library API metadata (getter of a Library, `() => Library`);
  set with a closure over reactive state, e.g. `library_context.set(() => library)`.
  Components with a `library` prop (`LibraryDetail`, `ApiIndex`, `ApiModule`)
  project the prop into this context for their subtree, so link components
  (`ModuleLink`, `DeclarationLink`, `DocsLink`, `TypeLink`) resolve against the
  rendered library — aggregators rendering a foreign library don't set the
  context themselves

**Documentation:**

- `tomes_context` - available documentation (Map<string, Tome>)
- `tome_context` - current documentation page (Tome)
- `docs_links_context` - documentation navigation (DocsLinks class)

The mdz contexts (`mdz_code_context`, `mdz_codeblock_context`, `mdz_base_context`,
`mdz_components_context`, `mdz_elements_context`) are defined in `@fuzdev/mdz`; fuz_ui
sets the code/codeblock ones to inject `DocsLink` / fuz_code `Code` (see mdz rendering
above).

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

Fuz combines manual tomes with auto-generated API docs, laid out by `<Docs>`
(the three-column responsive layout from the component catalog above).

**Tomes** - manual documentation pages. Define in `tomes.ts`, create matching
`+page.svelte` wrapping content in `<TomeContent>`. Categories: "guide",
"helpers", "components". See `src/routes/docs/tomes.ts` for examples.

**API documentation** - auto-generated from TypeScript/Svelte source with full
TSDoc support (build-time extraction, runtime mdz rendering — see
[mdz rendering](#mdz-rendering)). Setup requires the `svelte-docinfo` Vite
plugin (exposing `virtual:svelte-docinfo`) and API routes; see
`src/routes/docs/api/` for example routes.

## Known limitations

- **Early alpha** - API will change
- **SvelteKit dependency** - Some components require SvelteKit
- **Contextmenu focus** - APG-compliant focus management not yet implemented
- **Color optimization** - Build-time color optimization not implemented

## Project standards

- TypeScript strict mode
- Svelte 5 with runes API
- Prettier with tabs, 100 char width
- Node >= 22.15
- Tests in `src/test/` (not co-located)

### Code style

- `snake_case` for files, variables, functions
- `PascalCase` for types, classes, Svelte components
- Explicit file extensions in imports
- JSDoc comments use proper sentences with periods; inline comments can be
  fragments without capitals

## Fixture tests

fuz_ui has no fixture-based tests — they moved with their code: mdz and
`svelte_preprocess_mdz` fixtures live in `@fuzdev/mdz`, and TypeScript/Svelte/TSDoc
analysis fixtures live in `svelte-docinfo`.

## Related projects

- [`fuz_css`](../fuz_css/CLAUDE.md) - CSS framework (peer dependency)
- [`fuz_util`](../fuz_util/CLAUDE.md) - utility functions (peer dependency)
- [`mdz`](../mdz/CLAUDE.md) - markdown dialect rendered throughout the docs (optional peer)
- [`fuz_code`](../fuz_code/CLAUDE.md) - syntax highlighting injected into mdz code blocks (optional peer)
- [`svelte-docinfo`](../svelte-docinfo/CLAUDE.md) - TypeScript/Svelte static analysis (dev dependency; types + a few runtime helpers)
- [`fuz_template`](../fuz_template/CLAUDE.md) - starter template using fuz_ui
- [`fuz_blog`](../fuz_blog/CLAUDE.md) - blog template using fuz_ui
- [`fuz_mastodon`](../fuz_mastodon/CLAUDE.md) - Mastodon components using fuz_ui
