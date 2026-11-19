---
'@fuzdev/fuz_ui': minor
---

feat: `Docs` gets a `layout` prop, `'centered'` (the new default) or `'flush'`, and `AppShell` a `--sidebar_left` hook

breaking: standalone docs sites change appearance on wide screens. The tome menu sits against the centered page again, as it did before `Docs` moved onto `AppShell`; pass `layout="flush"` to keep it at the viewport's left edge. `--docs_content_max_width` and `--docs_content_padding` are now set on `.docs-shell` (on `.docs` only when nested), so override them there. `layout` has no effect when `Docs` is nested in an outer `AppShell`, whose own sidebar can set `--sidebar_left` (wide mode only).
