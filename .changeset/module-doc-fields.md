---
'@fuzdev/fuz_ui': minor
---

break: render module-comment doc fields in `ApiModule`, replacing `Module.has_module_comment` with `has_module_doc`

`Module` gains `examples`, `see_also`, `since`, `deprecated_message`, `internal_message`, `is_deprecated`, and `is_internal`, read from the svelte-docinfo `ModuleJson` doc fields. The module page renders them as a declaration's are (deprecated/internal chips and messages, since, examples, see also), and directory listings add the deprecated/internal chips. `has_module_doc` is true for a tag-only module comment, which has no `module_comment`. The fields come from svelte-docinfo's module-comment tag parsing (the release after 0.13.0); with an older svelte-docinfo they are absent and nothing extra renders.
