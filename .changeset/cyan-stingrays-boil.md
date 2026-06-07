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
- add `DialogContent`, the default content surface -- a padded, centered `.pane` card (`class` defaults to `box p_xl width_atmost_md`, `gutter` defaults to `var(--space_xl3)`)
- add `dialog_context` (and the `DialogContext` type) to `dialog.js`, set by `Dialog` and read by `DialogContent`, so content can close the dialog without threading `close` through the `children` snippet
- the `Dialog` and `DialogContent` `children` snippet now receives the `DialogContext` object (e.g. `{close}`) instead of `close` directly -- migrate by destructuring: `{#snippet children({close})}`
- `Dialog` no longer renders the inner content/gutter wrapper -- pair it with `DialogContent` (or render your own surface in `children`)
