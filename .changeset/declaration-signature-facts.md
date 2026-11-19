---
'@fuzdev/fuz_ui': minor
---

feat: API docs read the signature fields svelte-docinfo emits after 0.18.1, each by presence, so data without them keeps the flat signature. A type predicate or assertion return composes and links (`x is A`, `asserts x is A`), as do a `this` parameter, a destructured parameter (shown as its pattern, `{ a, b = 1 }`), and a `const` type parameter, where those signatures stayed flat. A function-typed property with one signature reads `readonly now: () => number` where it read as a method. Heritage clauses, generic constraints and defaults, and braced `@throws` types render from their trees. `Declaration` gains `return_predicate`, `this_type`, `this_type_info`, `extends_types_info`, and `implements_types_info`.

fix: a callback prop whose type declares a `this` parameter the data doesn't carry keeps its flat type, where composing dropped the `this`
