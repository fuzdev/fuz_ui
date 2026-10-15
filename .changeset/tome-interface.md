---
'@fuzdev/fuz_ui': minor
---

**breaking** feat: `Tome` is a TypeScript interface instead of a zod schema, and zod is no longer a peer dependency

- import `Tome` as a type, `import type {Tome}` or `{type Tome}`: it has no runtime value now, so a plain `import {Tome}` fails `verbatimModuleSyntax` (SvelteKit's default) and, in a `.svelte` file, fails to load with a missing export; code that already imports it as a type changes nothing
- `Tome.parse`, `Tome.safeParse`, `Tome.shape`, and the rest of the zod schema are gone; validate tomes with your own schema if you need to
