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

## Context and MdzRoot

`MdzRoot` is the context provider for mdz rendering. It sets `mdz_base_context`,
`mdz_components_context`, and `mdz_elements_context` via getter functions.
All three contexts use the getter pattern (`() => value | undefined`) and
support nesting with ancestor fallback.

```svelte
<MdzRoot base="/docs/mdz/" components={mdz_components} elements={mdz_elements}>
  <Mdz content={...} />
</MdzRoot>
```

When `base` is set, relative paths (`./`, `../`) are resolved to absolute
paths using `resolve_relative_path()` and SvelteKit's `resolve()`.
Without `base`, relative paths use raw hrefs (browser resolves them).

`Mdz` and `MdzStream` are pure renderers — they read contexts but don't
set them.

## Preprocessor

Static `<Mdz content="...">` usages are compiled at build time by
`svelte_preprocess_mdz` into `MdzPrecompiled` with pre-rendered children,
eliminating runtime parsing. The preprocessor recognizes a `base` attribute
on `<Mdz>` for build-time relative path resolution (this is a
preprocessor-only attribute, not a runtime prop). Without `base`, relative
paths use raw hrefs.
