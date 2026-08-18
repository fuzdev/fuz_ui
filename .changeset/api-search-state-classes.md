---
'@fuzdev/fuz_ui': minor
---

replace the `create_api_search`/`create_module_declaration_search` getter/setter factories with `ApiSearchState`/`DeclarationSearchState` classes — nested `modules`/`declarations` `{all, filtered}` objects flatten to `modules`, `modules_filtered`, `declarations`, `declarations_filtered` (and `all` → `declarations` on `DeclarationSearchState`)
