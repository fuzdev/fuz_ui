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
- `./path` and `../path` - relative internal paths, raw hrefs (browser resolves)

All auto-linked paths must be preceded by whitespace or start of string.
Trailing punctuation (`.,:;!?]`) is trimmed per GFM conventions.

## Preprocessor

Static `<Mdz content="...">` usages are compiled at build time by
`svelte_preprocess_mdz` into `MdzPrecompiled` with pre-rendered children,
eliminating runtime parsing. Relative paths skip the `resolve()` import
since the browser handles resolution.
