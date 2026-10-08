---
'@fuzdev/fuz_ui': minor
---

deps: upgrade fuz_css to 0.65.0 with its OKLCH color system

- The `@fuzdev/fuz_css` peer dependency is now `>=0.65.0`.
- `Theme` is imported from `@fuzdev/fuz_css/variable.ts` (was `theme.ts`).
- Palette variables follow fuz_css's rename to `--palette_X_NN` (was
  `--color_X_NN`): `Spiders`, `LibraryDetail`'s links, `DocsFooter`'s
  border, and `alert_status_options.help`.
- `alert_status_options.error` reads the `--negative_50` intent (was
  `--color_c_50`), and `ApiModulesList`'s no-match message takes the
  `negative_60` class (its `color_c` was a no-op).
- Button palette classes follow the rename to `palette_X` (was `color_X`,
  which no longer resolves): `ColorSchemeInput` and `ThemeInput` take
  `palette_a`, `CopyToClipboard`'s failed state `palette_c`, and
  `ModuleLink`'s Svelte module chips `palette_h`.
- `DialogContent`'s close button, and the `attrs` handed to a custom
  `close_button` snippet, take `sized_sm` (was `sm`).
- `Dialog`'s backdrop reads fuz_css's shared `--backdrop_color` (was
  `--dialog_bg`).
- `HueInput` previews hues in OKLCH, matching fuz_css's hue knobs.
- `ThemeInput` lists fuz_css's `default_themes`, now base and ledger; the
  low/high contrast themes became fuz_css's `contrast_modifiers`, which
  `ThemeInput` doesn't yet offer.
