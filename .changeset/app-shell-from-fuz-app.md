---
'@fuzdev/fuz_ui': minor
---

feat: add `AppShell`, `SidebarState` (`sidebar_state.svelte.ts`), `MenuLink`, and `ColumnLayout`, moved from `@fuzdev/fuz_app/ui/` with API changes for consumers switching over:

- `AppShell`: `sidebar_width` is a CSS length (`'240px'`), set inline only when passed, else `--sidebar_width` defaults to `180px` from CSS; the `toggle_button` snippet is removed (render a toggle anywhere, reading `sidebar_state_context` and the state's `id`); `sidebar_label` also names the built-in toggle; the keyboard shortcut ignores keys pressed with Ctrl, Meta, or Alt; the narrow overlay also closes on a hash change (an in-page link skips `afterNavigate`); new `--sidebar_top` hangs the wide sidebar below a top bar; cascade layers are `fuz_ui.app_shell_base` and `fuz_ui.app_shell_narrow`
- `SidebarState`: `show_sidebar_wide` → `show_wide`, `show_sidebar_narrow` → `show_narrow`, `show_sidebar` → `show`, `toggle_sidebar(value?)` → `toggle()` (set `show` to choose a value), the `sidebar_id` option and field → `id`; `activate()` and the `enabled` setter are removed (pass the `enabled` getter option)
- `MenuLink`: takes a resolved `href` in place of `path`, adds `exact` and a `selected` override, and server-renders `selected` and `aria-current` correctly (it rendered every link `selected`, and missed relative hrefs); a link to the site root now needs `exact`, since it contains every page
- `ColumnLayout`: `column_width` → `aside_width` (no inline default), `--column_width` → `--column_layout_aside_width`, `--column_toggle_bg` → `--column_layout_toggle_bg`; the stacked aside also closes on a hash change
- new `href_contains_current_page` in `page_helpers.ts`
