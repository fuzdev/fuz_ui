---
'@fuzdev/fuz_ui': minor
---

feat: API docs follow-ups — a declaration's fields are linkable: `DeclarationLink` takes a `field` (`field="toggle"` links `#Name.toggle`), `DocsLink` resolves `` `Name.field` `` and `` `Name.method()` `` in TSDoc prose to the field's anchor (`Declaration` gains `has_field`), and `DocsPageLinks` selects the owning declaration for a field's fragment. `DeclarationDetail` composes a callback prop's type from its parameters and return type (`load?: (themes?: Theme[]) => Theme`) so alias names survive and link, lists a member's overloads, moves a default that spans lines to a dedented block under the signature, quotes names that aren't identifiers (`'default-src'?: …`), renders linked types inside a signature as plain links, highlights the field its fragment targets, labels each field's hashlink with its target, renders `@throws` and `@mutates` descriptions as mdz, drops the `generics` section where a composed signature states them, and derives its heading levels from the enclosing `TomeSection` depth (labels are `h3` under an `h2` declaration, as on the API index).

breaking: `dedent_css_fallback` in `helpers.ts` is renamed `dedent_continuation_lines`, since it now also dedents multi-line defaults
