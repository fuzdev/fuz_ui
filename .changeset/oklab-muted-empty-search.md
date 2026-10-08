---
'@fuzdev/fuz_ui': patch
---

fix: mix component shadows in oklab and mute the empty API search results

`Card`, `Dialog`, `DocsPrimaryNav`, and `ProjectLinks` mix their shadows, and
`Sparkline` its default background, with `color-mix(in oklab, …)` (was
`in hsl`), matching fuz_css. A shadow color outside sRGB keeps its chroma
instead of being clipped to sRGB. The no-match messages of `ApiModulesList`
(was red `negative_60`) and `ApiDeclarationList` (was body text, now worded
"No declarations match your search.") render in muted `text_70`, since an
empty search isn't an error.
