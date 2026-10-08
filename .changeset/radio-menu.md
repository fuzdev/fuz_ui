---
'@fuzdev/fuz_ui': minor
---

feat: add `RadioMenu` and build `ColorSchemeInput` on it

`RadioMenu` is a horizontal menu of joined `menuitemradio` buttons with one
selected, generic over the option type: `options`, a bindable `value`, a
`label` function (also the default `title` and key), optional `title` and
`key` overrides, `onselect`, and a `children` snippet for custom button
content.

`ColorSchemeInput` is now a thin `RadioMenu` over `color_schemes`. It looks
and behaves the same, but its classes are `radio-menu` and
`radio-menu-item` (was `color-scheme-control` and `color-scheme`), and it
no longer forwards the `title`, `onselect`, and `children` HTML attributes
to its `menu`.
