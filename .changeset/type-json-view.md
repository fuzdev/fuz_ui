---
'@fuzdev/fuz_ui': minor
---

feat: render svelte-docinfo's structured `TypeJson` trees in API docs

- New `TypeJsonView` component renders a `typeInfo` tree as inline code with
  per-node linkification: `reference` nodes and alias-carrying
  unions/intersections link via `DeclarationLink` when the name resolves in
  the library, terminal type text stays syntax-highlighted, and structural
  punctuation (separators, parens, tuple labels) comes from svelte-docinfo's
  `typeJsonToTokens`.
- `TypeLink` takes an optional `type_info` and delegates to `TypeJsonView`
  when present, so composite types linkify per-node instead of the
  whole-string match.
- `DeclarationDetail` passes `typeInfo`/`returnTypeInfo` through at every
  type position (parameters, props, members, overloads, returns) and renders
  a structured type row for variable/type declarations, making
  svelte-docinfo's recovered alias names (`z.infer`-class lost aliases)
  visible and linked.
- `Declaration` gains `type_info` and `return_type_info` getters.

Requires svelte-docinfo >= 0.6 for `typeInfo` data; older output renders
unchanged (the fields are simply absent).
