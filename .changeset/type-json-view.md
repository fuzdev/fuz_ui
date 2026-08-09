---
'@fuzdev/fuz_ui': minor
---

feat: render svelte-docinfo's structured `TypeJson` trees in API docs

- New `TypeJsonView` component renders a `typeInfo` tree as inline code with
  per-node linkification: `reference` nodes and alias-carrying
  unions/intersections link via `DeclarationLink` when resolvable, terminal
  type text stays syntax-highlighted, and structural punctuation comes from
  svelte-docinfo's `typeJsonToTokens`.
- `TypeLink` takes an optional `type_info` and delegates to `TypeJsonView`,
  linkifying composite types per-node instead of whole-string matching.
- `DeclarationDetail` threads `typeInfo`/`returnTypeInfo` through every type
  position (parameters, props, members, overloads, returns) and adds a
  structured type row for variable/type declarations, so recovered alias
  names render linked.
- `Declaration` gains `type_info` and `return_type_info` getters.

Requires svelte-docinfo >= 0.6 (`typeInfo` data + `typeJsonToTokens`).
