---
'@fuzdev/fuz_ui': minor
---

**breaking:** rename `Declaration.intersects` to `Declaration.external_types`

Follows svelte-docinfo renaming the underlying field from `intersects` to
`externalTypes`. The field stopped being about intersections when the analyzer
learned to record bags reached through `interface Props extends Bag` and bare
references — it lists the external types whose properties are filtered out of
`props` / `members`, however the author composed them.

`DeclarationDetail` renders the section under the heading "external types".

Requires svelte-docinfo with the renamed field; against an older analysis the
getter reads `undefined` and the section does not render.
