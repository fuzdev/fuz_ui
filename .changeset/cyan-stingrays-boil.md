---
'@fuzdev/fuz_ui': minor
---

refactor: use the native `dialog` element in `Dialog`

- render a native `<dialog>` opened with `showModal()` instead of a teleported `role="dialog"` div
- remove the `active` prop
- remove the `container` prop
- add a `show` prop (default `true`) that gates rendering
- add a `dismissable` prop (default `true`) to toggle click-outside-to-close
- forward arbitrary `<dialog>` attributes via rest props
- remove `Dialogs`
- remove the `DialogParams` type and `to_dialog_params` helper from `dialog.js`
- add `DialogContent`, the default content surface: a padded, centered `.pane` card that shrinks to its content (`class` defaults to `box p_xl`, `gutter` to `var(--space_xl3)`, `max_width` to `var(--distance_md)`)
- `DialogContent` renders a `close_button` in the surface's top-right corner by default (a `.plain` icon button that closes the dialog); pass `close_button={false}` to remove it or a `Snippet` to customize it
- `DialogContent` takes a `pane` prop (default `true`) to toggle the fuz_css `.pane` card class; pass `pane={false}` for a chromeless surface
- `DialogContent` registers its surface with `Dialog` (via `dialog_context`), so click-outside-to-close detects presses inside the surface by node identity rather than the `.pane` class — `pane={false}` needs no extra `content_selector` setup
- add `register_surface` to `DialogContext`: an attachment (`{@attach register_surface}`) that registers a content surface so a press inside it isn't an outside-dismiss; `Dialog`'s `content_selector` becomes the fallback for surfaces rendered directly in `children`
- add `dialog_context` (and the `DialogContext` type) to `dialog.js`, set by `Dialog` and read by `DialogContent`, so content can close the dialog without threading `close` through the `children` snippet
- the `Dialog` and `DialogContent` `children` snippet now receives the `DialogContext` object (e.g. `{close}`) instead of `close` directly; migrate by destructuring: `{#snippet children({close})}`
- `Dialog` no longer renders the inner content/gutter wrapper; pair it with `DialogContent` (or render your own surface in `children`)
