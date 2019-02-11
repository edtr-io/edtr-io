# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased](https://github.com/edtr-io/edtr-io/compare/0.1.0..HEAD)

### Breaking Changes

- The newly added `<Editor />` replaces the removed `<EditorProvider />`. It sets up the `EditorContext` and renders an editor for the given `state`.
- Don't export API that isn't intended for external usage anymore.
- Rename `createDocumentIdentifier` to `createDocument`

### Added

- Handle serialization and deserialization of documents
- Add `<Editor />` that replaces `<EditorProvider />`

### Changed

- Rename `createDocumentIdentifier` to `createDocument`

### Removed

- Remove `<EditorProvider />` in favor of `<Editor />`

## [0.1.0](https://github.com/edtr-io/edtr-io/compare/723fb79110bdeec83889a6d6bc617ce2d455d4ff..0.1.0) - February 8, 2019

Initial release
