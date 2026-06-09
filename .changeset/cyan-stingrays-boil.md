---
'@fuzdev/fuz_ui': minor
---

refactor: use the native `<dialog>` element in `Dialog`

- `Dialog` now renders a native `<dialog>` opened with `showModal()`, so it traps focus, closes on Escape, restores focus, and dims the page natively -- no more `Teleport`
- breaking: remove the `active` and `container` props, the `Dialogs` component, and the `DialogParams` type and `to_dialog_params` helper
- breaking: pair `Dialog` with the new `DialogContent` (or render your own surface in `children`); the `children` snippet now receives a context object, so destructure `close` from it: `{#snippet children({close})}`
- add `Dialog` props `show` (gates rendering), `dismissable` (click-outside-to-close), and `onbeforeclose` (return `false` to veto a close); `<dialog>` attributes forward via rest props
- add `DialogContent`, the default content surface: a centered `.pane` card with a floating close button -- `pane={false}` for a chromeless surface, `close_button={false}` to drop the button (or pass a `Snippet` to customize it)
