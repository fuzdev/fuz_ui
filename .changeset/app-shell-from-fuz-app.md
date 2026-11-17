---
'@fuzdev/fuz_ui': minor
---

feat: add `AppShell`, `SidebarState` (`sidebar_state.svelte.ts`), `MenuLink`, and `ColumnLayout`, moved from `@fuzdev/fuz_app/ui/`; the shell's cascade layers are now `fuz_ui.app_shell_base` and `fuz_ui.app_shell_narrow`, and the narrow overlay now also closes on a hash change (an in-page link, which skips `afterNavigate`)
