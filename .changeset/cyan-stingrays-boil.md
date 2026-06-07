---
'@fuzdev/fuz_ui': minor
---

refactor: use the native `dialog` element in `Dialog`

- render a native `<dialog>` opened with `showModal()` instead of a teleported `role="dialog"` div
- remove the `active` prop
- remove the `container` prop
- add a `show` prop (default `true`) that gates rendering
- remove `Dialogs`
- remove the `DialogParams` type and `to_dialog_params` helper from `dialog.js`
