---
'@fuzdev/fuz_ui': minor
---

feat: improve csp API. **Breaking.**

- replace `create_csp_directives` options with three-stage pipeline: `replace_defaults` → `extend` → `overrides`
- rename `csp_trusted_sources_of_fuzdev` → `csp_directives_of_fuzdev` (now a `Partial<CspDirectives>` map)
- per-key `undefined` is a no-op in all three stages; per-key `null` in `extend` throws with a pointer to `overrides`
- friendlier errors for non-object `extend` entries and non-string source elements
