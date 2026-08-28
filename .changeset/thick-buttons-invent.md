---
'@fuzdev/fuz_ui': minor
---

feat: adopt svelte-docinfo 0.7 and render its `@internal` and merged-value metadata

- `Declaration` gains `internal_message` / `is_internal` (from svelte-docinfo's
  `@internal` tag support — a marker, not an exclusion) and `merged_value` (the
  name is importable as a runtime value, not just a type). `DeclarationDetail`
  renders an "internal" chip and message on declarations and members (component
  props deliberately never carry the tag), and a "value + type" chip for merged
  declarations.
- `Declaration` gains `type_info_expanded` — `type_info` with the alias's
  self-reference stripped from the root — and `DeclarationDetail`'s structured
  type row renders it, so a union alias like `type DialogAlign = 'center' |
  'top'` documents its members at its own declaration instead of linking
  circularly to itself.

The rendered fields shipped in svelte-docinfo 0.6; the dependency range moves
to `^0.7.0` for its `@mutates` / `{@link}` / `@throws` extraction fixes.
