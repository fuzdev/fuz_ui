---
'@fuzdev/fuz_ui': patch
---

fix: `HueInput` parses with `parse_hue` from `@fuzdev/fuz_util/colors.ts`, so clearing the number field no longer snaps the hue to 0; the `@fuzdev/fuz_util` peer dependency is now `>=0.72.0`
