---
'@fuzdev/fuz_ui': patch
---

fix: `DeclarationDetail` renders `@default` on function members

svelte-docinfo 0.6 emits `defaultValue` on callable members of any container
kind — callable properties, method shorthands, class methods — documenting the
behavior used when the callback is omitted. The members section gated the
default row on `kind === 'variable'`, so those defaults silently dropped;
the gate now admits function members too (constructors never carry one).
