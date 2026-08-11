---
'@fuzdev/fuz_ui': minor
---

feat: render svelte-docinfo's structured `TypeJson` trees in API docs

- New `TypeJsonView` renders a `typeInfo` tree as inline code: `reference`
  nodes and alias-carrying unions/intersections link via `DeclarationLink`
  (module-scoped when the analysis names the declaring module), terminal type
  text stays syntax-highlighted, and punctuation comes from svelte-docinfo's
  `typeJsonToTokens`.
- `TypeLink` takes an optional `type_info` and delegates to `TypeJsonView`.
- `DeclarationDetail` threads `typeInfo`/`returnTypeInfo` through every type
  position and adds a structured type row for variable/type declarations.
- `Declaration` gains `type_info` and `return_type_info` getters.

Requires svelte-docinfo >= 0.6.
