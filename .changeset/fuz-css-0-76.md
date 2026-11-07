---
'@fuzdev/fuz_ui': minor
---

break: upgrade to fuz_css 0.76 - the `@fuzdev/fuz_css` peer is `>=0.76.0`

fuz_css 0.76 makes contrast one `--contrast` knob that the high-contrast modifier sets, and removes the low-contrast modifier, so `contrast_modifiers` is `{high}`. `save_theme` persists only `{name, contrast: 'high'}` compositions, and `load_theme` loads a `{name, contrast: 'low'}` saved by an earlier release as the registry theme `name`, uncomposed. A whole low-contrast composition saved before 0.223 (when compositions were saved whole) still parses and loads as a custom theme under its saved name.
