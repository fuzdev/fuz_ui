---
'@fuzdev/fuz_ui': minor
---

break: `ThemeRoot` takes a `themes` registry and an injected `resolve_theme`, persists themes by reference, and `save_theme(theme, themes?, key?)` and `load_theme(themes?, fallback?, key?)` take the registry

A registry theme saves by its name and a registry theme composed with a contrast modifier as `{name, contrast}`, so a load takes the registry's current version, recomposed; any other theme saves whole, trimmed to `name`, `summary`, `scheme`, and `variables`, and `parse_saved_theme` is the parsing half of `load_theme`. Inject `resolve_theme_stance` from `@fuzdev/fuz_css/theme_stance.ts` as `resolve_theme` so a single-scheme theme like `phosphor` renders its stance mirror: `ThemeRoot` throws at creation when `themes` or `theme_fallback` holds a stanced theme without it, and a stanced theme outside `themes` - from storage or set at runtime - logs an error and renders without its mirror.
