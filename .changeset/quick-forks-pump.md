---
'@fuzdev/fuz_ui': minor
---

deps: upgrade fuz_css to 0.65.0 with its OKLCH color system

- The `@fuzdev/fuz_css` peer dependency is now `>=0.65.0`.
- `Theme` types come from `@fuzdev/fuz_css/variable.ts`, where fuz_css
  moved them.
- Colors read fuz_css's renamed palette variables (`--palette_X_NN`, was
  `--color_X_NN`): `Spiders`, `LibraryDetail`'s links, `DocsFooter`'s
  border, and the `help` and `error` colors in `alert.ts`'s
  `alert_status_options`.
- Classes follow fuz_css's renames: `CopyToClipboard`'s failed state
  takes `palette_c` (was `color_c`) and `ModuleLink` colors Svelte module
  chips with `palette_h` (was `color_h`), restoring styles the old names
  lost; `ApiModulesList`'s no-match message is now colored `negative_60`
  (its `color_c` was a no-op on a paragraph).
- `DialogContent`'s default close button takes the `sized_sm` composite
  (was `sm`, which fuz_css renamed), and so do the `attrs` handed to a
  custom `close_button` snippet.
- `Dialog`'s backdrop dim reads fuz_css's shared `--backdrop_color`
  variable (was `--dialog_bg`), so one theme variable retints every
  backdrop, native and component alike.
- `HueInput` previews hues in OKLCH, matching what fuz_css's hue knobs
  produce.
- `ThemeInput` lists fuz_css's `default_themes`, now base and ledger - the
  low/high contrast themes moved to fuz_css's `contrast_modifiers`, which
  `ThemeInput` doesn't yet offer.
