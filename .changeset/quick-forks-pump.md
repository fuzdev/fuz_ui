---
'@fuzdev/fuz_ui': minor
---

deps: upgrade fuz_css with oklch

- `Dialog`'s backdrop dim reads fuz_css's shared `--backdrop_color`
  variable (was `--dialog_bg`), so one theme variable retints every
  backdrop, native and component alike.
- `ThemeRoot` warns in dev when a single-scheme theme arrives without its
  `scheme_mirror` - resolve with `resolve_theme_stance` before rendering.
- Contrast becomes a modifier, matching fuz_css's registry rework:
  `ThemeState` gains `contrast` (the selected modifier, persisted under
  `fuz:contrast`) and `composed_theme` (the base theme with the modifier
  composed over it via `compose_themes`), which `ThemeRoot` now renders.
  `ThemeInput` grows a contrast select fed by fuz_css's
  `contrast_modifiers` (override or hide with its `contrast_modifiers`
  prop) - without it, pickers would lose low/high contrast entirely now
  that the pair left `default_themes`. Both light up when the fuz_css dep
  ships the new APIs; against older releases they no-op.
- Utility classes follow fuz_css's property-first palette naming:
  `palette_X_NN` → `color_X_NN` (the bare `.palette_a`-`.palette_j`
  component conventions are unchanged).
