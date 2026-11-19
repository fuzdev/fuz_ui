---
'@fuzdev/fuz_ui': minor
---

break: API docs need data from svelte-docinfo 0.19.0 or later, whose signature fields they read in place of the flat signature. Data from an earlier svelte-docinfo renders a type predicate return as its `boolean`, drops a `this` parameter and a `const` type parameter's modifier, and names a destructured parameter `__0`.

feat: a type predicate or assertion return composes and links (`x is A`, `asserts x is A`), as do a `this` parameter, a destructured parameter (shown as its pattern, `{ a, b = 1 }`), and a `const` type parameter. A function-typed property with one signature reads `readonly now: () => number`. Heritage clauses, generic constraints and defaults, and braced `@throws` types render from their trees. `Declaration` gains `return_predicate`, `this_type`, `this_type_info`, `extends_types_info`, and `implements_types_info`.
