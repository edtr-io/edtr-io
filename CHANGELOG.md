# Changelog

All notable changes to this project will be documented in this file.

## [0.2.1](https://github.com/edtr-io/edtr-io/compare/0.2.0..0.2.1) - February 28, 2019

### Added

- Added Rich-Text plugin
- Added Anchor plugin
- Added Blockquote plugin
- Added Code Highlight plugin
- Added Spoiler Plugin
- Added Undo and Redo to reducer
- Added Persist to reducer
- Added `changed` callback to Editor. The callback is called on every Action passing a boolean if the content changed since the last `PersistAction` was dispatched.

## [0.2.0](https://github.com/edtr-io/edtr-io/compare/0.1.0..0.2.0) - February 18, 2019

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

## [0.1.0](https://github.com/edtr-io/edtr-io/compare/723fb79110bdeec83889a6d6bc617ce2d455d4ff..0.1.0) - February 8, 2019

Initial release
