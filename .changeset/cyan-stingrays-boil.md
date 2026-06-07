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
