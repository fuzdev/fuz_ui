---
'@fuzdev/fuz_ui': minor
---

feat: rebuild `Docs` on `AppShell` — the tome menu is the shell's sidebar (a fixed 240px beside the content, an overlay at or below 800px opened from the primary nav's menu button), and the page links are a sticky column above 1000px that moves into the sidebar at or below it, all by CSS

- nested in any outer `AppShell`, `Docs` renders only the page and its links column: the outer sidebar must render a `DocsMenu` (or the menu is missing) and, for narrow screens, a `DocsPageLinks` under a `docs_links_context` set above both, which `Docs` then shares; `primary_nav`, `secondary_nav_header`, and `secondary_nav_footer` don't render (DEV warns); `--docs_sticky_top` offsets the sticky column below an outer header
- `DocsMenu` takes tomes as `DocsMenuTome` (`slug`, `title`, `category` only), so a site's own nav can list them without importing their page components, and marks the current tome through `href_is_current_page` (it compared a relative server href to the pathname), now also with `aria-current="page"`; `tome_to_title` and `tome_to_pathname` take the same narrower shapes
- every docs page now ships `AppShell`'s inline `<style media>` in the head, which needs CSP `style-src-elem 'unsafe-inline'` (the `csp.ts` defaults allow it)

breaking: `Docs` renders inside an `.app-shell.docs-shell` root instead of `display: contents`, and its `main` no longer clips overflow; `DocsSecondaryNav` is now a plain `nav` (its rest props are `nav` attributes) without fixed positioning; `DocsTertiaryNav` loses its fixed positioning and background (`Docs` positions it); `DocsSecondaryNav`, `DocsTertiaryNav`, and `DocsPageLinks` drop their `sidebar` prop; `DocsMenu`, `DocsPageLinks`, and `DocsList` drop `expand_width` and always fill their container; `--docs_sidebar_width`, `--docs_secondary_nav_padding`, and `--docs_menu_width` are gone, and `--docs_primary_nav_height` is set on the shell root, so it's absent in nested mode
