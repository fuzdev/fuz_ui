---
'@fuzdev/fuz_ui': minor
---

feat: rebuild `Docs` on `AppShell` — the tome menu is the shell's sidebar (an overlay at or below 800px, opened from the primary nav's menu button), the page links are a sticky column above 1000px and move into the sidebar at or below it, and nested in an outer `AppShell`, `Docs` renders only the page and its links column (the outer sidebar renders a `DocsMenu`; `primary_nav`, `secondary_nav_header`, and `secondary_nav_footer` don't render); `--docs_nested_top` offsets the sticky column below an outer header

breaking: `Docs` renders inside an `.app-shell.docs-shell` root instead of `display: contents`; `DocsSecondaryNav` is now a plain `nav` (its rest props are `nav` attributes) without fixed positioning, and its menu always fills the sidebar's width; `DocsTertiaryNav` loses its fixed positioning and background (`Docs` positions it); `DocsSecondaryNav`, `DocsTertiaryNav`, and `DocsPageLinks` drop their `sidebar` prop; `--docs_sidebar_width` and `--docs_secondary_nav_padding` are gone, and `--docs_primary_nav_height` is set on the shell root, so it's absent in nested mode
