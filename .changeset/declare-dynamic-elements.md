---
'@fuzdev/fuz_ui': patch
---

fix: declare the dynamic tags of `TomeSectionHeader`, `TomeHeader`, and `Card` for fuz_css

These components render through `svelte:element`, which fuz_css's extractor
can't see, so an app with no literal `<h2>` (for example) got no `h2` base
styles and its section headers fell back to inherited font size. Each now
declares its styled tags with `@fuz-elements`: `h2 h3 h4` for
`TomeSectionHeader`, `h1 h2` for `TomeHeader`, and `a` for a linked `Card`.
