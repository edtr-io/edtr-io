# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased](https://github.com/edtr-io/edtr-io/compare/v0.7.0..HEAD)

### Changed

- **plugin-rows**. add-button is now always visible under the focused document

## [0.7.0](https://github.com/edtr-io/edtr-io/compare/v0.6.2..v0.7.0) - July 6, 2019

### Breaking Changes

- **core**. The state exposed in `EditorContext` introduces an additional layer to support multiple editor instances. Use the `useStore` helper instead to get the `{ store: { getState() }, dispatch }` of the scoped document.
- **core**. `EditorContext` now exposes `{ store: { getState() }, dispatch }` instead of `{ state, dispatch }`. Therefore, we also removed the `EditorContextValue` type export
- **core**. Removed `ActionType` export. Use the exported public action creators `actions` instead
- **core**. Removed export \`ActionCommitType
- **core**. Renamed type `PluginState` to `DocumentState`
- **core**. Selectors aren't exported directly anymore. Instead use the new `selectors` export.
- **core**. `selectors.serializeRootDocument` replaces the previous `serializeDocument` (`selectors.serializeDocument` can be used to serialize a non-root document)
- **core**. `Editor` doesn't accept changed anymore. Instead, the optional prop `onChange` get's called with `{ changed: boolean, document: DocumentState | null }` where `changed` indicates whether there are pending changes and `document` is the serialized root document.
- **core**. Removed previous exports `Document` and `DocumentProps`
- **core**. `onChange` callback now accepts `{ changed, getDocument() }` to avoid serializing the document if not needed
- **plugin-h5p**. Removed `@edtr-io/plugin-hp5`
- **plugin-image**. Changed configs for createImagePlugin and removed Upload export
- **plugin-rows**. Deprecated PrimarySettingsWrapper now removed. Use PrimarySettings from package editor-ui instead.

### Added

- **core**. To connect to the store, you can either use the exposed `useStore` or our newly exposed `connect` and `connectStateOnly`. If you want to connect to all editor instances use `EditorContext` (e.g. with `React.useContext`)
- **core**. Exposes a new Component `Document` that has to be rendered into an `EditorProvider`. In contrast to `Editor`, it accepts an additional prop `scope` and is not editable by default. Documents sharing the same scope use the same store state.

### Changed

- Various performance improvements
- **core**. The exposed hooks now optionally accept the scope. If it is not provided, it uses the scope of the parent `Editor`

### Removed

- **plugin-h5p**. Since our `serlo.h5p.com` trial expired, we don't publish `@edtr-io/h5p-plugin` anymore

### Fixed

- **core**. Various fixes to history handling (e.g. resetting to the last persisted state after undoing the last change)
- **plugin-text**. Fix positioning of text controls on touch devices

### Internal

- **core**. Use `redux` & `redux-saga` instead of `React.useReducer`. Since we are passing our own context to `redux`, you can still use `redux` in your own application. The store should be considered as an implementation detail
- **core**. Replace `uuid` with `shortid`

## [0.6.2](https://github.com/edtr-io/edtr-io/compare/v0.6.1..v0.6.2) - June 19, 2019

### Added

- **editor-ui**. Add component PrimarySettings. Use this to wrap Settings displayed directly in page for common styling.

### Deprecated

- **plugin-rows**. PrimarySettingsWrapper from props passed to children is now deprecated, use PrimarySettings from editor-ui instead.

### Fixed

- **plugin-image**. Do not lose focus in PrimarySettings
- **plugin-image**. Display Placeholder on empty image

## [0.6.1](https://github.com/edtr-io/edtr-io/compare/v0.6.0..v0.6.1) - June 13, 2019

### Breaking Changes

- **plugin-image**. Changed configs for createImagePlugin and removed Upload export

### Added

- **core**. Added StateType upload for file uploading.

## [0.6.0](https://github.com/edtr-io/edtr-io/compare/v0.5.0..v0.6.0) - May 22, 2019

### Breaking Changes

- **core**. Requires additional peer-dependencies `react-dnd@^7.0.0` and `react-dnd-html5-backend@^7.0.0`

### Added

- **core**. Editor accepts a new boolean prop `omitDragDropContext`. If set to `true`, the editor won't render `react-dnd`'s `DragDropContextProvider`
- **plugin-files**. Add plugin for file uploads
- **plugin-rows**. Pass `renderIntoExtendedSettings` and `PrimarySettings` as props to children
- **plugin-text**. Poweruser-Feature: Add new plugins with /[plugintitle] in editmode

### Changed

- **plugin-rows**. Adapt styles and controls implemented by schul-cloud, including drag&drop
- **plugin-rows**. Add full color theming support

### Fixed

- **plugin-text**. Fix key conflicts of merge and remove on backspace ([#123](https://github.com/edtr-io/edtr-io/issues/123))
- **plugin-spoiler**, **plugin-solution**, **plugin-hint**, **plugin-equations**. Make children traversable

## [0.5.0](https://github.com/edtr-io/edtr-io/compare/v0.4.3..v0.5.0) - May 9, 2019

### Breaking Changes

- **core**. Mark `name` as required in `StatelessEditorProps`
- **plugin-image**. Image-plugin has new required `maxWidth` - state property
- **ui**. Theming is handled differently. We now differentiate between editor ui elements, renderer ui elements and plugins. Furthermore, we now use a different (but more consistent) naming scheme.
- **ui**. Moved editor ui elements (e.g. `Button`, `SettingsOverlay`) to the new package `@edtr-io/editor-ui`.
- **ui**. Moved renderer ui elements (e.g. `ExpandableBox`) to the new package `@edtr-io/renderer-ui`

### Added

- **plugin-h5p**. Add H5p.com plugin
- **plugin-image**. Add MaxWidth for images
- **plugin-rows**. Added more theming options
- **core**. Added `isEmpty(state: State, id: string)` to check if a plugin state is empty
- **core**. Added optional function `isEmpty: (state: StateDescriptorValueType<S>) => boolean` to plugin definition
- **plugin-text**. Added visual latex editor
- **plugin-text**. Added headings plugin
- **plugin-text**. Added list plugin
- **plugin-text**. Added colors plugin
- **plugin-text**. Added button to wrap in a blockquote plugin
- **plugin-rows**. Pass `remove` and `replace` functions to childs
- **all**. Added plugin icons and descriptions
- **plugin-text**. Added Markdownshortcuts for Lists, Headings and Blockquotes.
- **core**. Pass plugin props and name of parents to childs too
- **plugin-text**. Leave nested Text-Plugins on second Enter key press

### Changed

- **plugin-text**. Hide placeholder in render mode
- **plugin-text**. Hovering Menu for text formatting
- **plugin-text**. Styling of inline-overlay improved
- **ui** / **editor-ui** / **renderer-ui**. Revised theming workflow
- **ui**. reworked the ui of several plugins (image, video, anchor, geogebra, h5p, highlight, hint, solution and spoiler)
- **plugin-rows**. Improved styling of add menu and controls
- **core**. Add new text plugin on Enter and delete empty plugins on backspace and delete

### Fixed

- **plugin-image**. Hide config-overlay in render mode

### Internal

- **demo**. Log errors only
- **demo**. Add additional examples for plugin-usage in Storybook

## [0.4.3](https://github.com/edtr-io/edtr-io/compare/v0.4.2..v0.4.3) - March 29, 2019

### Added

- **ui**. Add `ContainerWithConfigButton` component for opening the Settings Overlay.
- **plugin-geogebra**. Use ContainerWithConfigButton
- **plugin-equations**. Add plugin for aligned equations
- **plugin-hint**. Add plugin for hints
- **plugin-image**. Use ContainerWithConfigButton
- **plugin-input-exercise**. Add plugin for input exercises
- **plugin-sc-mc-exercise**. Add plugin for single-choice & multiple-choice exercises
- **plugin-solution**. Add plugin for solutions
- **plugin-video**. Use ContainerWithConfigButton
- **plugin-text**. Merge with previous / next text plugin on backspace / delete when at start / end of plugin

### Fixed

- **plugin-geogebra**. Scale applet with container size preserving aspect ratio
- **plugin-geogebra**. Accept full GeoGebra material link too
- **plugin-image**. Center image
- **plugin-text**. Display Link-Overlay only when plugin is focused
- **plugin-text**. Refocus after bold/italic button click

## [0.4.2](https://github.com/edtr-io/edtr-io/compare/v0.4.1..v0.4.2) - March 25, 2019

### Added

- **core**. `Editor` now additionally accepts a render callback as `children` prop
- **core**. Added `useEditorFocus`, `useEditorHistory`, `useEditorMode` custom React hooks to simplify the building of a custom ui
- **core**. Added `Reset` action that resets the current editor state to the last persisted value
- **core**. Handle focus for all documents
- **core**. Added optional `onKeyDown` callback to plugins which allows plugins to cancel the default editor keydown handlers
- **demo**. Added containers to demo storybook. Initially, we have a "plain" container (equivalent to the previosly existing demo) and a "Serlo" container (mocking integration into [serlo.org](https://de.serlo.org). You can select your preferred container in the storybook's addon panel on the right.
- **core**. Added `name` prop to plugins
- **ui**. Added Checkbox, Button and Textarea components for overlay
- **plugin-image**. Added `onPaste` handler accepting jpg, png, bmp, gif, svg
- **plugin-video**. Added video plugin

### Fixed

- **core**. Handle focus in nested documents correctly
- **plugin-rows**. Align top and bottom add butons correctly in custom integrations
- **plugin-text**. Disable slate undo/redo
- **plugin-text**. Refocus after undo/redo

### Internal

- **demo**. Plugins available to the demo storybook are now defined in `demo/src/plugins.tsx`
- **demo**. Added `build-demo` task that builds the demo storybook (and deploys it automatically to Netlify). The demo of the master branch is available on <https://demo.edtr.io>
- **demo**. Brand the demo storybook

## [0.4.1](https://github.com/edtr-io/edtr-io/compare/v0.4.0..v0.4.1) - March 22, 2019

### Added

- Use Theming in toolbars and menus.

## [0.4.0](https://github.com/edtr-io/edtr-io/compare/v0.3.2..v0.4.0) - March 21, 2019

### Breaking Changes

- Moved rows plugin from `@edtr-io/ui` to `@edtr-io/plugin-rows`
- Replaced `showOverlay` and `hideOverlay` with an `OverlayContext`

### Added

- Added `InlineOverlay` component for plugin controls
- Added focus previous / focus next actions
- Added optional `getFocusableChildren` to stateful plugins, which is used to resolve the previous / next focusable child

### Changed

- **plugin-text**. Handle focus when using arrow keys

### Fixed

- **plugin-text**. Focus / blur slate depending on `props.focused`

## [0.3.2](https://github.com/edtr-io/edtr-io/compare/v0.3.1..v0.3.2) - March 14, 2019

### Added

- Added Image plugin
- Added `editable` prop to `Editor` for switching between edit and render mode
- Added optional `onPaste` callback to plugins, which is called by the text plugin on paste event

## [0.3.1](https://github.com/edtr-io/edtr-io/compare/v0.3.0..v0.3.1) - March 13, 2019

### Added

- Add move Up/Down functionality to Rows plugin
- Add clipboard to rows plugin add-menu
- Add Cut / Copy actions to Rows plugin
- GeoGebra plugin

### Changed

- **plugin-spoiler**. Remove input element in render mode
- Settings Overlay now closes with click outside of the modal

### Fixed

- **plugin-text**. Don't dispatch selection changes anymore

## [0.3.0](https://github.com/edtr-io/edtr-io/compare/v0.2.1..v0.3.0) - March 8, 2019

### Breaking Changes

- Removed `DocumentIdentifier`. You should pass the state to `<Editor />` instead
- Removed `state` prop from `Document`. You should pass only the id as `id` prop instead.
- Removed `value` property from `StateType.object`. The values are now exposed directly on `[key]`.

### Added

- Added a menu for selecting a plugin on insert to rows plugin

### Changed

- State Descriptors uniformly return their value/items/object by invoking the state.

### Fixed

- Only trigger `changed` if the number of pending changes changed

## [0.2.1](https://github.com/edtr-io/edtr-io/compare/v0.2.0..v0.2.1) - February 28, 2019

### Added

- Added Rich-Text plugin
- Added Anchor plugin
- Added Blockquote plugin
- Added Code Highlight plugin
- Added Spoiler Plugin
- Added Undo and Redo to reducer
- Added Persist to reducer
- Added `changed` callback to Editor. The callback is called on every Action passing a boolean if the content changed since the last `PersistAction` was dispatched.

## [0.2.0](https://github.com/edtr-io/edtr-io/compare/v0.1.0..v0.2.0) - February 18, 2019

### Breaking Changes

- The newly added `<Editor />` replaces the removed `<EditorProvider />`. It sets up the `EditorContext` and renders an editor for the given `state`.
- Don't export API that isn't intended for external usage anymore.
- Rename `createDocumentIdentifier` to `createDocument`
- Remove `StatefulPlugin.createInitialState` in favor of `StatefulPlugin.state`
- Plugins no longer receive `onChange`. Use the provided setters & helpers on `state` instead

### Added

- Handle serialization and deserialization of documents
- Add `<Editor />` that replaces `<EditorProvider />`
- Add `StateType.scalar` that represents a value of the given type (more specifically: `StateType.boolean`, `StateType.number`, `StateType.child`
- Add `StateType.list`, `State.object`
- Add slate for rich text and links. Standard Bold + Italic hotkeys supported.

### Changed

- Rename `createDocumentIdentifier` to `createDocument`

### Removed

- Remove `<EditorProvider />` in favor of `<Editor />`

## [0.1.0](https://github.com/edtr-io/edtr-io/compare/723fb79110bdeec83889a6d6bc617ce2d455d4ff..v0.1.0) - February 8, 2019

Initial release
