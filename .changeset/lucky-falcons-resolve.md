---
'@fuzdev/fuz_ui': minor
---

feat: scope library docs resolution to the rendered library

Breaking: `library_context` now holds a getter (`() => Library`) instead of a `Library`, so consumers stay reactive when the library changes without remounting. Migrate setters:

```diff
-const library = library_context.set(new Library(library_json));
+const library = new Library(library_json);
+library_context.set(() => library);
```

and getters:

```diff
-const library = library_context.get();
+const get_library = library_context.get();
+const library = $derived(get_library());
```

`LibraryDetail`, `ApiIndex`, and `ApiModule` now project their `library` prop into `library_context` for their subtree, so `ModuleLink`/`DeclarationLink`/`DocsLink` descendants resolve against the rendered library. Aggregators rendering a foreign library no longer need to set the context themselves or key the component on the library.
