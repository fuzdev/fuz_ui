---
'@fuzdev/fuz_ui': minor
---

fix: make `@fuzdev/fuz_util` a required peer (was optional) — it's imported across core `src/lib` and no framework peer guarantees it, so an optional peer left a clean install broken. npm auto-installs required peers and dedupes to the consumer's single copy
