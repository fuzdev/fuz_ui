---
'@fuzdev/fuz_ui': minor
---

**breaking:** rename `Declaration.extends_type` to `Declaration.extends_types`, now `Array<string> | undefined`

svelte-docinfo 0.6 makes class `extends` an array like every other heritage
field, so the string case is gone: the getter drops it, takes the plural name
beside `implements_types`, and `DeclarationDetail` iterates heritage uniformly
instead of normalizing with `Array.isArray`. Absent when the declaration has no
`extends` clause (empty defaulted arrays strip on the wire).
