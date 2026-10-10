---
'@fuzdev/fuz_ui': minor
---

**breaking** feat: support SvelteKit 3 (`@sveltejs/kit` peer `^3`, `@fuzdev/gro` peer `>=0.214.0`, the first Gro that supports SvelteKit 3)

- `Redirect` navigates with kit 3's `goto` option `replace` (was the deprecated `replaceState`), and falls back to `location.replace` for URLs `goto` rejects - kit 3's `goto` rejects same-origin URLs that aren't app routes, and `Redirect` to another host now redirects client-side too
- `href_is_current_page` takes any `Pick<URL, 'href' | 'origin' | 'pathname'>`, so kit 3's readonly `page.url` fits
- `create_csp_directives` TSDoc names the flat `csp.directives` option passed to `sveltekit()`
