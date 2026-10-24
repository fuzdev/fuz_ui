---
'@fuzdev/fuz_ui': minor
---

feat: render a component's CSS custom properties in `DeclarationDetail`

`Declaration` gains `css_custom_properties`, read from the svelte-docinfo `ComponentDeclarationJson.cssCustomProperties` field. `DeclarationDetail` lists them after the props, with each property's description, syntax, and fallback; when a list mixes both, it marks the ones inferred from a `var()` fallback rather than documented with a `@cssprop` tag. The field comes from svelte-docinfo 0.16.0's CSS custom property analysis, so the `svelte-docinfo` dev dependency is now `^0.16.0`; data from an older svelte-docinfo has no field, and nothing extra renders.
