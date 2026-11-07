---
'@fuzdev/fuz_ui': patch
---

fix: `load_theme` loads a whole saved theme named like a registry theme's contrast composition (`ledger (high contrast)`) as the registry's current composition, so a composition saved whole before 0.223 stops loading as a stale snapshot
