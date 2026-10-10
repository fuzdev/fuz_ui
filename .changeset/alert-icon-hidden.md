---
'@fuzdev/fuz_ui': patch
---

fix: `Alert`'s icon is `aria-hidden`, an empty `icon` renders none as `null` does, and `AlertStatusOptions.icon` is a `string`, so each status shows its own icon rather than falling back to `inform`'s
