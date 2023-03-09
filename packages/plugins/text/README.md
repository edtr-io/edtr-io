# Text plugin (`TextEditor`)

## Table of contents

- [Usage](#usage)
- [Structure](#structure)
- [Technical decisions](#technical-decisions)
  - [Configuration](#configuration)
  - [Controls (Text plugin plugins)](#controls-text-plugin-plugins)
  - [Suggestions (`serlo-editor`/`edtr-io` plugins)](#suggestions-serlo-editoredtr-io-plugins)
  - [Saving state to `Redux` store](#saving-state-to-redux-store)
    - [`LinkControls` workaround](#linkcontrols-workaround)

## Usage

An example of how to use the Text plugin can be found in `./__fixtures__/index.ts`.

## Structure

The `./src/index.tsx` file contains and exposes the Text plugin factory function and exposes the public types.

Additionally, there are:

- `components` - React components
- `hooks` - plugable hooks for configuration
- `plugins` - [Slate plugin](https://docs.slatejs.org/concepts/08-plugins) files
- `types` - TypeScript types used across the Text plugin (React component prop types are located in their respective component files)
- `utils` - utility functions used across the Text plugin

## Technical decisions

### Configuration

A `config` argument (of `TextEditorConfig` type) is passed to `createTextPlugin` factory, when creating a new Text plugin instance.

This argument is then passed to the `useTextConfig` hook, where it's merged with the default settings, as well as enriched with `i18n` and theming.

The `config` object received from the `useTextConfig` hook is then used as the source of truth for configuration across that instance of the Text plugin.

### Controls (Text plugin plugins)

Currently used Slate version only allows Slate plugins to modify the `editor` object. To allow for the same functionality of plugins from the earlier version of `serlo-editor`/`edtr-io`, a hook approach was used ([as recommended by the creator of Slate](https://github.com/ianstormtaylor/slate/issues/3222#issuecomment-573331151)).

The `useControls` hook receives the `config` object and exposes three properties:

1. `createTextEditor` - a function that receives a Slate editor instance and wraps it in all the configured Slate plugins
2. `toolbarControls` - the configuration for Text plugin's toolbar
3. `handleHotkeys` - keyboard shortcut handlers for configured controls

This approach allows to simply pass an array of desired controls (as `controls` property of the `config` argument) when creating a Text plugin instance, thus making the controls easily configurable for the user of Text plugin.

### Suggestions (`serlo-editor`/`edtr-io` plugins)

In order to easily transform a Text plugin into another `serlo-editor`/`edtr-io` plugin, the user can simply type `/` into an empty Text plugin, and they will be presented with a list of suggestions. A hook approach was used to make the suggestions easily configurable.

The `useSuggestions` hook receives:

- the list of enabled plugins from the `config` object
- current `text` content of the Text plugin
- the `id` of the Text plugin
- `focused` and `editable` states of the Text plugin

and exposes:

1. `showSuggestions` - a flag controlling if the suggestions box should be shown
2. `suggestionsProps` - props for the `Suggestions` component
3. `hotKeysProps` - props for the `HotKeys` component
4. `handleHotkeys` - keyboard shortcut handlers for configured controls

### Saving state to `Redux` store

In order to enable global undo/redo behavior (TODO: and maybe other things?), any content changes are saved to the store, and previous values of `Editor`'s `value` and `selection` are saved as refs withing the instance of Text plugin component.

If a portion of the content is selected and then replaced with some text, undo will restore the replaced content and the selection. Slate `Editor`'s `value` prop is used only as an initial value and changing the bound value will not result in a rerender. Therefore, we have to manually assign the value to `editor.children` ([as recommended by the Slate team](https://github.com/ianstormtaylor/slate/releases/tag/slate-react%400.67.0)).

Simple selection changes are not saved to the store, because we don't want to undo pure selection changes.

#### `LinkControls` workaround

The `LinkControls` component should only be shown if the selection is currently on a link inline. But, since we don't save pure selection changes to the store, `LinkControls` doesn't rerender on selection changes. To work around this problem, a simple `useState` hook is used:

1. `hasSelectionChanged` is passed to `LinkControls`, where it's used a dependency in a `useEffect` hook which takes care of showing `LinkControls`
2. `setHasSelectionChanged` is called whenever selection changes, which increments `hasSelectionChanged` and makes sure `LinkControls` visibility will be updated
