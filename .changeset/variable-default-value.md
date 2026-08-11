---
'@fuzdev/fuz_ui': minor
---

feat: render `@default` on top-level variable declarations

`Declaration` gains a `default_value` getter and `DeclarationDetail` renders it
beside the type signature; previously a module-level `@default` documented
nothing.
