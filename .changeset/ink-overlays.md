---
'@fuzdev/fuz_ui': minor
---

**breaking** fix: `DocsList` and `Card` use fuz_css 0.67's `--ink_*` overlays, and the `@fuzdev/fuz_css` peer is `>=0.67.0`

- under fuz_css 0.67 the `--fg_*` variables they used are gone, so the docs menu lost its hover, selected, and highlighted backgrounds and `Card` its fill
- upgrade `@fuzdev/fuz_css` to 0.67 with this release; `--ink_*` doesn't exist before it
