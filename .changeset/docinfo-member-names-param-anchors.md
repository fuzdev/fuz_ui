---
'@fuzdev/fuz_ui': minor
---

feat: API docs read svelte-docinfo's newer fields: a callable property written with a named function type heads as `handler: Handler` (the function type it expands is its hover text), a destructured parameter anchors and labels its documented properties by its `@param` name (`f.options`, `options.git`) instead of `__0`, and a declaration's import line names the source file (`@pkg/lib/foo.ts`) when the package's `exports` map that extension
