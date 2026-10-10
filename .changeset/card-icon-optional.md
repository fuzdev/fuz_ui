---
'@fuzdev/fuz_ui': minor
---

**breaking** feat: `Card` shows no icon unless given one, where it defaulted to 🔗 for a link and 🪧 otherwise, and an absent, `null`, or empty `icon` renders no icon element; pass `icon="🔗"` to keep the old look, and drop `icon=""` and empty `{#snippet icon()}{/snippet}` opt-outs
