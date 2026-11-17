---
'@fuzdev/fuz_ui': patch
---

fix: `DocsPrimaryNav` renders inside an iframe too, so an embedded docs site keeps its breadcrumb and, on narrow screens, the menu button (the tome menu was unreachable there), and no longer leaves a gap above the wide sidebar or flashes out after hydration
