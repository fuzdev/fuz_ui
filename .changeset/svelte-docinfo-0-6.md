---
'@fuzdev/fuz_ui': minor
---

**breaking:** adapt to svelte-docinfo 0.6

- Rename `Declaration.intersects` to `Declaration.external_types`, following
  the upstream field rename — it lists the external types whose contributions
  are filtered out of `props`/`members`, however the author composed them.
  `DeclarationDetail`'s section heading is now "external types".
- Rename `Declaration.extends_type` to `Declaration.extends_types`, now
  `Array<string> | undefined` — class `extends` is an array like every other
  heritage field; absent when there is no `extends` clause.
- `DeclarationDetail` dedupes external types against the inheritance section —
  0.6 records direct external heritage in both `externalTypes` and the
  verbatim `extends`/`implements` clauses.
- `DeclarationDetail` renders `@default` on function members — 0.6 emits
  `defaultValue` on callable members; the default row was gated on
  `kind === 'variable'`.

Requires svelte-docinfo >= 0.6.
