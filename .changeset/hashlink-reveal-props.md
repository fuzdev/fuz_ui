---
'@fuzdev/fuz_ui': patch
---

feat: `Hashlink` takes `--hashlink_opacity` and `--hashlink_font_size` and no longer shrinks in a flex row, so a parent reveals it on hover with `.parent:hover { --hashlink_opacity: 1; }` instead of `:global(.hashlink)`
