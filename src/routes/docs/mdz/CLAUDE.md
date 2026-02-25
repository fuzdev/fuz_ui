# mdz docs

mdz (minimal markdown dialect) documentation routes.

## Pages

- `+page.svelte` - main docs page with interactive examples and usage guide
- `grammar/mdz_grammar.mdz` - formal grammar specification (rendered via Mdz)
- `spec/mdz_spec.mdz` - comprehensive spec with examples (rendered via Mdz)
- `fixtures/` - debug page rendering all test fixtures with JSON output

The grammar and spec are `.mdz` files imported with `?raw` and rendered by the
`Mdz` component — mdz documenting itself.

## Auto-linking

mdz auto-links four path patterns:

- `https://` and `http://` - external URLs (`link_type: 'external'`)
- `/path` - absolute internal paths, resolved via SvelteKit `resolve()`
- `./path` and `../path` - relative internal paths

All auto-linked paths must be preceded by whitespace or start of string.
Trailing punctuation (`.,:;!?]`) is trimmed per GFM conventions.

## Base path resolution

The `base` prop on `Mdz` (and `mdz_base_context` context) controls how
relative paths (`./`, `../`) are resolved. When `base` is set (e.g.,
`'/docs/mdz/'`), relative paths are resolved to absolute paths using
`new URL(reference, 'file://' + base).pathname` and then passed through
SvelteKit's `resolve()`. Without `base`, relative paths use raw hrefs
(browser resolves them against the current URL).

## Preprocessor

Static `<Mdz content="...">` usages are compiled at build time by
`svelte_preprocess_mdz` into `MdzPrecompiled` with pre-rendered children,
eliminating runtime parsing. When a static `base` prop is present, relative
paths are resolved at build time and the `base` prop is excluded from the
precompiled output. Without `base`, relative paths use raw hrefs.
