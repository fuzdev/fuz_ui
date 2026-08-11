---
'@fuzdev/fuz_ui': patch
---

fix: `DeclarationDetail` dedupes external types against the inheritance section

svelte-docinfo 0.6 populates `externalTypes` on interfaces and classes, and
on direct external heritage (`interface Props extends HTMLButtonAttributes`)
the producer deliberately records the same name in both `externalTypes` and
the verbatim `extends` clause. The external-types section now renders only
entries the inheritance section doesn't already display, so the common
direct-heritage case shows each name once; transitive reach (a bag behind a
local base) still gets its own external-types entry.
