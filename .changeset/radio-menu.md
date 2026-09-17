---
'@fuzdev/fuz_ui': minor
---

feat: `RadioMenu`, and the theme inputs use fuz_css's `palette_a` convention

`RadioMenu` is a horizontal menu of joined `menuitemradio` buttons with one
selected, generic over the option type: `options`, a bindable `value`, a
`label` function (also the default `title` and list key), optional `title`
and `key` overrides, `onselect`, and a `children` snippet for custom button
content. `ColorSchemeInput` is now a thin `RadioMenu` over `color_schemes`;
its markup and styles are unchanged.

`ColorSchemeInput` and `ThemeInput` buttons take the `palette_a` class -
`color_a` was the bare component convention before fuz_css's palette
rename and no longer resolves.
