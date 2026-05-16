# mdz docs

mdz (minimal markdown dialect) documentation routes.

## Pages

- `+page.svelte` - main docs page with interactive examples and usage guide
- `streaming/mdz_streaming.mdz` - rendering paths, opcodes, streaming model (rendered via Mdz)
- `grammar/mdz_grammar.mdz` - formal grammar specification (rendered via Mdz)
- `spec/mdz_spec.mdz` - comprehensive spec with examples (rendered via Mdz)
- `fixtures/` - debug page rendering all test fixtures with JSON output

The streaming, grammar, and spec are `.mdz` files imported with `?raw` and
rendered by the `Mdz` component — mdz documenting itself.

## Auto-linking

mdz auto-links four path patterns:

- `https://` and `http://` - external URLs (`link_type: 'external'`)
- `/path` - absolute internal paths, resolved via SvelteKit `resolve()`
- `./path` and `../path` - relative internal paths

All auto-linked paths must be preceded by whitespace or start of string.
Trailing punctuation (`.,:;!?]`) is trimmed per GFM conventions.

## Context and MdzRoot

`mdz_base_context`, `mdz_components_context`, and `mdz_elements_context` use
the getter pattern (`() => value | undefined`) so changes flow through without
an extra effect. All three support nesting with ancestor fallback.

```svelte
<MdzRoot base="/docs/mdz/" components={mdz_components} elements={mdz_elements}>
  <Mdz content={...} />
</MdzRoot>
```

`MdzRoot` is the typical context provider — it sets all three contexts.
`Mdz` and `MdzStream` also accept a `base` prop and set `mdz_base_context`
themselves (with ancestor fallback), so single-file usage works without
wrapping in `MdzRoot`. Components and elements must come from `MdzRoot` or
a manually set context.

When `base` is set, relative paths (`./`, `../`) are resolved to absolute
paths using `resolve_relative_path()` and SvelteKit's `resolve()`.
Without `base`, relative paths use raw hrefs (browser resolves them).

The fallback pattern is encapsulated in `set_mdz_context_with_fallback()` —
prefer it over calling `.set(() => value ?? ancestor?.())` by hand.

## Preprocessor

Static `<Mdz content="...">` usages are compiled at build time by
`svelte_preprocess_mdz` into `MdzPrecompiled` with pre-rendered children,
eliminating runtime parsing. The preprocessor recognizes a `base` attribute
on `<Mdz>` for build-time relative path resolution (this is a
preprocessor-only attribute, not a runtime prop). Without `base`, relative
paths use raw hrefs.
