---
'@fuzdev/fuz_ui': minor
---

feat: improve csp API

- replace `create_csp_directives` options with three-stage pipeline:
  `replace_defaults` → `extend` → `overrides`
- remove the trust-level surface: `CspTrustLevel`, `CspSourceSpec`,
  `csp_trust_levels`, `csp_trust_level_value`, `parse_csp_trust_level`,
  `is_csp_trusted`, `csp_directive_required_trust_defaults`. Migrate
  `{source, trust}` entries to per-directive arrays under `extend`.
- rename `csp_trusted_sources_of_fuzdev` → `csp_directives_of_fuzdev`;
  now a `Partial<CspDirectives>` scoped to `img-src`, `media-src`,
  `font-src`, `connect-src`, `frame-src`, and `frame-ancestors`
  (previously applied to all directives via trust levels — re-add to
  other directives explicitly if you relied on that).
- per-key `undefined` is a no-op in all three stages; per-key `null` in
  `extend` throws with a pointer to `overrides`
- friendlier errors for non-object `extend` entries and non-string
  source elements
- defaults: add `'wasm-unsafe-eval'` to `script-src` and `worker-src`
  (allows WASM compile; `eval` and `new Function` remain blocked); add
  `'data:'` to `media-src`
