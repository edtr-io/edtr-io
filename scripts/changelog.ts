import { generateChangelog } from '@splish-me/changelog'
import * as fs from 'fs'
import * as path from 'path'
import * as util from 'util'

const writeFile = util.promisify(fs.writeFile)

exec().then(() => {})

async function exec(): Promise<void> {
  const content = await generateChangelog([
    {
      tagName: 'v0.1.0',
      name: '0.1.0',
      date: '2019-02-08',
      description: 'Initial release'
    },
    {
      tagName: 'v0.2.0',
      name: '0.2.0',
      date: '2019-02-18',
      breakingChanges: [
        'The newly added `<Editor />` replaces the removed `<EditorProvider />`. It sets up the `EditorContext` and renders an editor for the given `state`.',
        "Don't export API that isn't intended for external usage anymore.",
        'Rename `createDocumentIdentifier` to `createDocument`',
        'Remove `StatefulPlugin.createInitialState` in favor of `StatefulPlugin.state`',
        'Plugins no longer receive `onChange`. Use the provided setters & helpers on `state` instead'
      ],
      added: [
        'Handle serialization and deserialization of documents',
        'Add `<Editor />` that replaces `<EditorProvider />`',
        'Add `StateType.scalar` that represents a value of the given type (more specifically: `StateType.boolean`, `StateType.number`, `StateType.child`',
        'Add `StateType.list`, `State.object`',
        'Add slate for rich text and links. Standard Bold + Italic hotkeys supported.'
      ],
      changed: ['Rename `createDocumentIdentifier` to `createDocument`'],
      removed: ['Remove `<EditorProvider />` in favor of `<Editor />`']
    },
    {
      tagName: 'v0.2.1',
      name: '0.2.1',
      date: '2019-02-28',
      added: [
        'Added Rich-Text plugin',
        'Added Anchor plugin',
        'Added Blockquote plugin',
        'Added Code Highlight plugin',
        'Added Spoiler Plugin',
        'Added Undo and Redo to reducer',
        'Added Persist to reducer',
        'Added `changed` callback to Editor. The callback is called on every Action passing a boolean if the content changed since the last `PersistAction` was dispatched.'
      ]
    },
    {
      tagName: 'v0.3.0',
      name: '0.3.0',
      date: '2019-03-08',
      added: ['Added a menu for selecting a plugin on insert to rows plugin'],
      changed: [
        'State Descriptors uniformly return their value/items/object by invoking the state.'
      ],
      fixed: [
        'Only trigger `changed` if the number of pending changes changed'
      ],
      breakingChanges: [
        'Removed `DocumentIdentifier`. You should pass the state to `<Editor />` instead',
        'Removed `state` prop from `Document`. You should pass only the id as `id` prop instead.',
        'Removed `value` property from `StateType.object`. The values are now exposed directly on `[key]`.'
      ]
    },
    {
      tagName: 'v0.3.1',
      name: '0.3.1',
      date: '2019-03-13',
      added: [
        'Add move Up/Down functionality to Rows plugin',
        'Add clipboard to rows plugin add-menu',
        'Add Cut / Copy actions to Rows plugin',
        'GeoGebra plugin'
      ],
      changed: [
        '**plugin-spoiler**. Remove input element in render mode',
        'Settings Overlay now closes with click outside of the modal'
      ],
      fixed: ["**plugin-text**. Don't dispatch selection changes anymore"]
    },
    {
      tagName: 'v0.3.2',
      name: '0.3.2',
      date: '2019-03-14',
      added: [
        'Added Image plugin',
        'Added `editable` prop to `Editor` for switching between edit and render mode',
        'Added optional `onPaste` callback to plugins, which is called by the text plugin on paste event'
      ]
    },
    {
      tagName: 'v0.4.0',
      name: '0.4.0',
      date: '2019-03-21',
      breakingChanges: [
        'Moved rows plugin from `@edtr-io/ui` to `@edtr-io/plugin-rows`',
        'Replaced `showOverlay` and `hideOverlay` with an `OverlayContext`'
      ],
      added: [
        'Added `InlineOverlay` component for plugin controls',
        'Added focus previous / focus next actions',
        'Added optional `getFocusableChildren` to stateful plugins, which is used to resolve the previous / next focusable child'
      ],
      changed: ['**plugin-text**. Handle focus when using arrow keys'],
      fixed: [
        '**plugin-text**. Focus / blur slate depending on `props.focused`'
      ]
    },
    {
      tagName: 'v0.4.1',
      name: '0.4.1',
      date: '2019-03-22',
      added: ['Use Theming in toolbars and menus.']
    },
    {
      tagName: 'v0.4.2',
      name: '0.4.2',
      date: '2019-03-25',
      added: [
        '**core**. `Editor` now additionally accepts a render callback as `children` prop',
        '**core**. Added `useEditorFocus`, `useEditorHistory`, `useEditorMode` custom React hooks to simplify the building of a custom ui',
        '**core**. Added `Reset` action that resets the current editor state to the last persisted value',
        '**core**. Handle focus for all documents',
        '**core**. Added optional `onKeyDown` callback to plugins which allows plugins to cancel the default editor keydown handlers',
        '**demo**. Added containers to demo storybook. Initially, we have a "plain" container (equivalent to the previosly existing demo) and a "Serlo" container (mocking integration into [serlo.org](https://de.serlo.org). You can select your preferred container in the storybook\'s addon panel on the right.',
        '**core**. Added `name` prop to plugins',
        '**ui**. Added Checkbox, Button and Textarea components for overlay',
        '**plugin-image**. Added `onPaste` handler accepting jpg, png, bmp, gif, svg',
        '**plugin-video**. Added video plugin'
      ],
      fixed: [
        '**core**. Handle focus in nested documents correctly',
        '**plugin-rows**. Align top and bottom add butons correctly in custom integrations',
        '**plugin-text**. Disable slate undo/redo',
        '**plugin-text**. Refocus after undo/redo'
      ],
      internal: [
        '**demo**. Plugins available to the demo storybook are now defined in `demo/src/plugins.tsx`',
        '**demo**. Added `build-demo` task that builds the demo storybook (and deploys it automatically to Netlify). The demo of the master branch is available on https://demo.edtr.io',
        '**demo**. Brand the demo storybook'
      ]
    },
    {
      tagName: 'v0.4.3',
      name: '0.4.3',
      date: '2019-03-29',
      added: [
        '**ui**. Add `ContainerWithConfigButton` component for opening the Settings Overlay.',
        '**plugin-geogebra**. Use ContainerWithConfigButton',
        '**plugin-equations**. Add plugin for aligned equations',
        '**plugin-hint**. Add plugin for hints',
        '**plugin-image**. Use ContainerWithConfigButton',
        '**plugin-input-exercise**. Add plugin for input exercises',
        '**plugin-sc-mc-exercise**. Add plugin for single-choice & multiple-choice exercises',
        '**plugin-solution**. Add plugin for solutions',
        '**plugin-video**. Use ContainerWithConfigButton',
        '**plugin-text**. Merge with previous / next text plugin on backspace / delete when at start / end of plugin'
      ],
      fixed: [
        '**plugin-geogebra**. Scale applet with container size preserving aspect ratio',
        '**plugin-geogebra**. Accept full GeoGebra material link too',
        '**plugin-image**. Center image',
        '**plugin-text**. Display Link-Overlay only when plugin is focused',
        '**plugin-text**. Refocus after bold/italic button click'
      ]
    },
    {
      tagName: 'v0.5.0',
      name: '0.5.0',
      date: '2019-05-09',
      breakingChanges: [
        '**core**. Mark `name` as required in `StatelessEditorProps`',
        '**plugin-image**. Image-plugin has new required `maxWidth` - state property',
        '**ui**. Theming is handled differently. We now differentiate between editor ui elements, renderer ui elements and plugins. Furthermore, we now use a different (but more consistent) naming scheme.',
        '**ui**. Moved editor ui elements (e.g. `Button`, `SettingsOverlay`) to the new package `@edtr-io/editor-ui`.',
        '**ui**. Moved renderer ui elements (e.g. `ExpandableBox`) to the new package `@edtr-io/renderer-ui`'
      ],
      added: [
        '**plugin-h5p**. Add H5p.com plugin',
        '**plugin-image**. Add MaxWidth for images',
        '**plugin-rows**. Added more theming options',
        '**core**. Added `isEmpty(state: State, id: string)` to check if a plugin state is empty',
        '**core**. Added optional function `isEmpty: (state: StateDescriptorValueType<S>) => boolean` to plugin definition',
        '**plugin-text**. Added visual latex editor',
        '**plugin-text**. Added headings plugin',
        '**plugin-text**. Added list plugin',
        '**plugin-text**. Added colors plugin',
        '**plugin-text**. Added button to wrap in a blockquote plugin',
        '**plugin-rows**. Pass `remove` and `replace` functions to childs',
        '**all**. Added plugin icons and descriptions',
        '**plugin-text**. Added Markdownshortcuts for Lists, Headings and Blockquotes.',
        '**core**. Pass plugin props and name of parents to childs too',
        '**plugin-text**. Leave nested Text-Plugins on second Enter key press'
      ],
      changed: [
        '**plugin-text**. Hide placeholder in render mode',
        '**plugin-text**. Hovering Menu for text formatting',
        '**plugin-text**. Styling of inline-overlay improved',
        '**ui** / **editor-ui** / **renderer-ui**. Revised theming workflow',
        '**ui**. reworked the ui of several plugins (image, video, anchor, geogebra, h5p, highlight, hint, solution and spoiler)',
        '**plugin-rows**. Improved styling of add menu and controls',
        '**core**. Add new text plugin on Enter and delete empty plugins on backspace and delete'
      ],
      fixed: ['**plugin-image**. Hide config-overlay in render mode'],
      internal: [
        '**demo**. Log errors only',
        '**demo**. Add additional examples for plugin-usage in Storybook'
      ]
    },
    {
      tagName: 'v0.6.0',
      name: '0.6.0',
      date: '2019-05-22',
      breakingChanges: [
        '**core**. Requires additional peer-dependencies `react-dnd@^7.0.0` and `react-dnd-html5-backend@^7.0.0`'
      ],
      added: [
        "**core**. Editor accepts a new boolean prop `omitDragDropContext`. If set to `true`, the editor won't render `react-dnd`'s  `DragDropContextProvider`",
        '**plugin-files**. Add plugin for file uploads',
        '**plugin-rows**. Pass `renderIntoExtendedSettings` and `PrimarySettings` as props to children',
        '**plugin-text**. Poweruser-Feature: Add new plugins with /[plugintitle] in editmode'
      ],
      changed: [
        '**plugin-rows**. Adapt styles and controls implemented by schul-cloud, including drag&drop',
        '**plugin-rows**. Add full color theming support'
      ],
      fixed: [
        '**plugin-text**. Fix key conflicts of merge and remove on backspace ([#123](https://github.com/edtr-io/edtr-io/issues/123))',
        '**plugin-spoiler**, **plugin-solution**, **plugin-hint**, **plugin-equations**. Make children traversable'
      ]
    },
    {
      tagName: 'v0.6.1',
      name: '0.6.1',
      date: '2019-06-13',
      breakingChanges: [
        '**plugin-image**. Changed configs for createImagePlugin and removed Upload export'
      ],
      added: ['**core**. Added StateType upload for file uploading.']
    },
    {
      tagName: 'v0.6.2',
      name: '0.6.2',
      date: '2019-06-19',
      deprecated: [
        '**plugin-rows**. PrimarySettingsWrapper from props passed to children is now deprecated, use PrimarySettings from editor-ui instead.'
      ],
      added: [
        '**editor-ui**. Add component PrimarySettings. Use this to wrap Settings displayed directly in page for common styling.'
      ],
      fixed: [
        '**plugin-image**. Do not lose focus in PrimarySettings',
        '**plugin-image**. Display Placeholder on empty image'
      ]
    },
    {
      tagName: 'v0.7.0',
      name: '0.7.0',
      date: '2019-07-06',
      breakingChanges: [
        '**core**. The state exposed in `EditorContext` introduces an additional layer to support multiple editor instances. Use the `useStore` helper instead to get the `{ store: { getState() }, dispatch }` of the scoped document.',
        '**core**. `EditorContext` now exposes `{ store: { getState() }, dispatch }` instead of `{ state, dispatch }`. Therefore, we also removed the `EditorContextValue` type export',
        '**core**. Removed `ActionType` export. Use the exported public action creators `actions` instead',
        '**core**. Removed export `ActionCommitType',
        '**core**. Renamed type `PluginState` to `DocumentState`',
        "**core**. Selectors aren't exported directly anymore. Instead use the new `selectors` export.",
        '**core**. `selectors.serializeRootDocument` replaces the previous `serializeDocument` (`selectors.serializeDocument` can be used to serialize a non-root document)',
        "**core**. `Editor` doesn't accept changed anymore. Instead, the optional prop `onChange` get's called with `{ changed: boolean, document: DocumentState | null }` where `changed` indicates whether there are pending changes and `document` is the serialized root document.",
        '**core**. Removed previous exports `Document` and `DocumentProps`',
        '**core**. `onChange` callback now accepts `{ changed, getDocument() }` to avoid serializing the document if not needed',
        '**plugin-h5p**. Removed `@edtr-io/plugin-hp5`',
        '**plugin-image**. Changed configs for createImagePlugin and removed Upload export',
        '**plugin-rows**. Deprecated PrimarySettingsWrapper now removed. Use PrimarySettings from package editor-ui instead.'
      ],
      added: [
        '**core**. To connect to the store, you can either use the exposed `useStore` or our newly exposed `connect` and `connectStateOnly`. If you want to connect to all editor instances use `EditorContext` (e.g. with `React.useContext`)',
        '**core**. Exposes a new Component `Document` that has to be rendered into an `EditorProvider`. In contrast to `Editor`, it accepts an additional prop `scope` and is not editable by default. Documents sharing the same scope use the same store state.'
      ],
      fixed: [
        '**core**. Various fixes to history handling (e.g. resetting to the last persisted state after undoing the last change)',
        '**plugin-text**. Fix positioning of text controls on touch devices'
      ],
      removed: [
        "**plugin-h5p**. Since our `serlo.h5p.com` trial expired, we don't publish `@edtr-io/h5p-plugin` anymore"
      ],
      changed: [
        'Various performance improvements',
        '**core**. The exposed hooks now optionally accept the scope. If it is not provided, it uses the scope of the parent `Editor`'
      ],
      internal: [
        '**core**. Use `redux` & `redux-saga` instead of `React.useReducer`. Since we are passing our own context to `redux`, you can still use `redux` in your own application. The store should be considered as an implementation detail',
        '**core**. Replace `uuid` with `shortid`'
      ]
    },
    {
      tagName: 'v0.7.1',
      name: '0.7.1',
      date: '2019-07-21',
      changed: [
        'Optimize bundle size',
        '**plugin-rows**. add-button is now always visible under the focused document'
      ],
      added: [
        '**core**. Add `StateType.migratable` that allows to update plugin state structure without breaking changes',
        '**plugin-important-statement**. Plugin that highlights important statements.',
        '**plugin-serlo-injection**. Add plugin for injecting serlo.org content',
        '**plugin-table**. Add plugin for markdown tables'
      ],
      fixed: ['**plugin-text**. Split plugin when pasting multiple blocks']
    },
    {
      tagName: 'v0.8.0',
      name: '0.8.0',
      date: '2019-08-01',
      breakingChanges: [
        'When using the newly exposed `<Renderer />`, `defaultPlugin` is no longer set to an actual plugin. So you should only rely on `defaultPlugin` in an editable environment (e.g. to decide which plugin to insert by default) and only pass complete serialized Edtr.io documents to `<Renderer />`.',
        "**plugin-text**. We no longer import KaTeX's stylesheet to not depend on a CSS-capable bundler. Please include the stylesheet yourself."
      ],
      added: [
        '**renderer**. Expose `<Renderer />` that renders a Edtr.io document with the given plugins with React. We plan to optimize its bundle size to minimize loading times for use cases where no editor is needed. Also, we plan to provide smaller renderer bundles for some of our plugins (e.g. text plugin)',
        '**renderer-ssr**. Expose `render` that server-side renders a Edtr.io document with the given plugins and returns `{ styles, html }`.',
        '**plugin-text**. Add possibility to write inline-code via CTRL+Q'
      ],
      changed: [
        '**plugin-text**. Make plugin capable to be rendered server-side'
      ],
      fixed: [
        '**plugin-important-statement**. Actually build the plugin before publishing'
      ],
      internal: [
        'Tests in `__tests-ssr__` folders are executed `node` environment to test SSR (in contrast to tests in `__tests__` folders that are executed in a browser-like environment)'
      ]
    },
    {
      tagName: 'v0.8.1',
      name: '0.8.1',
      date: '2019-08-09',
      fixed: [
        '**core**. Fix `StateType.upload`',
        '**core**. Export `MigratableStateDescriptor`',
        "**plugin-rows**. Add menu doesn't jump to the top of the root document anymore"
      ]
    },
    {
      tagName: 'v0.8.2',
      name: '0.8.2',
      date: '2019-08-14',
      changed: ['Various naming improvements', 'Various small UX improvements'],
      fixed: [
        'Add missing dependencies in various packages',
        '**core**. Review public API. For example, `useScopedStore` is now correctly part of the public API.'
      ],
      internal: [
        'Enable eslint rules to enforce consistency in our import statements (automatically fixable with `yarn format`)',
        'Enable eslint rules that warn for common errors in imports (e.g. missing dependencies, ...)'
      ]
    },
    {
      tagName: 'v0.8.3',
      name: '0.8.3',
      date: '2019-08-22',
      changed: [
        '**plugin-equations**. Heavily simplified for first release',
        '**plugin-sc-mc-exercise**. Complete redesign'
      ],
      fixed: [
        '**plugin-highlight**. Handle arrow keys and enter within textarea',
        '**plugin-rows**. Show add button when no children exist',
        '**plugin-table**. Handle arrow keys and enter within textarea'
      ]
    },
    {
      tagName: 'v0.9.0',
      name: '0.9.0',
      date: '2019-08-24',
      breakingChanges: [
        '**core**. `createStore` has a new required option `createStoreEnhancer`. Our high-level API (e.g. `<Editor />`, `<EditorProvider />` and `<Renderer />`) handle that change in a non-breaking way, though.'
      ],
      added: ['**core**. Expose `getUndoStack` and `getRedoStack` selectors'],
      changed: [
        '**core**. Store no longer applies enhancers used for testing or development purposes. Instead,  `<Editor />`, `<EditorProvider />` and `<Renderer />` provide a new optional prop `createStoreEnhancer` that allows to extend the store enhancer used. Our previous enhancer for development is published as a new package `@edtr-io/store-devtools` (e.g. used in our demo).'
      ]
    },
    {
      tagName: 'v0.9.1',
      name: '0.9.1',
      date: '2019-08-24',
      description:
        "Redeployment of previous release since some types weren't published correctly."
    },
    {
      tagName: 'v0.9.2',
      name: '0.9.2',
      date: '2019-08-25',
      added: [
        '**plugin-text**. Make available plugins customizable via new export `createTextPlugin`',
        '**plugin-rows**. Make available plugins customizable via new export `createRowsPlugin`'
      ]
    },
    {
      tagName: 'v0.9.3',
      name: '0.9.3',
      date: '2019-08-29',
      added: [
        '**plugin-table**. Add placeholder for empty tables',
        '**plugin-text**. Fixed persisting of math formulas'
      ]
    },
    {
      tagName: 'v0.9.4',
      name: '0.9.4',
      date: '2019-08-30',
      added: [
        '**core**. Editor is now able to recover from errors. If any error is thrown in the subtree, the respective `<Document />` offers users to undo their last change. Furthermore, `<Editor />` now accepts an optional `onError` prop that gets called with the thrown error.',
        '**plugin-rows**. Open plugin menu only when the respective button got clicked (instead of making the whole row clickable)',
        '**plugin-sc-mc-exercise**. Display a preview in edit mode and simplify focusing of exercises.'
      ]
    },
    {
      tagName: 'v0.9.5',
      name: '0.9.5',
      date: '2019-09-04',
      added: [
        '**plugin-sc-mc-exercise**. Make preview overlay not editable',
        '**plugin-table**. Allow overriding of markdown renderer via newly exported `createTablePlugin`'
      ]
    },
    {
      tagName: 'v0.9.6',
      name: '0.9.6',
      date: '2019-09-06',
      added: [
        '**plugin-text**. Remember math mode preference (visual vs. LaTeX)'
      ],
      changed: ['**core**. Improve performance']
    },
    {
      tagName: 'v0.9.7',
      name: '0.9.7',
      date: '2019-09-06',
      description:
        "Redeployment of previous release since some types weren't published correctly."
    },
    {
      tagName: 'v0.10.0',
      name: '0.10.0',
      date: '2019-09-07',
      breakingChanges: [
        `**core** Moved \`actions\` and \`selectors\` to the new package\`@edtr-io/store\`:
\`\`\`.js
// before
import { actions, selectors } from '@edtr-io/core'
console.log(actions.undo, selectors.getDocument)
// now
import { undo, getDocument } from '@edtr-io/store'
console.log(undo, getDocument)
\`\`\``,
        `**core**. Moved \`Plugin\`, \`StatefulPluginEditorProps\`, \`StatelessPluginEditorProps\`, \`StatefulPlugin\`, \`StatelessPlugin\` and \`StateType\` to the new package \`@edtr-io/plugin\`:
\`\`\`.js
// before
import { StateType, StatefulPluginEditorProps } from '@edtr-io/core'
const state = StateType.string()
// now
import { string, StatefulPluginEditorProps } from '@edtr-io/plugin'
const state = string()
\`\`\``,
        '**core**. Removed `connect`, `connectDispatchOnly` and `connectStateOnly`. Instead, we now export hooks `useDispatch`, `useSelector` and `useStore` (with scoped counterparts `useScopedDispatch`, `useScopedSelector` and `useScopedStore`)',
        '**core**. Removed `useEditorFocus` and `useEditorHistory` since they can easily be replicated with the new `useScopedDispatch` and `useScopedSelector` hooks',
        '**core**. Moved all store exports (e.g. `createStore`) to the new package `@edtr-io/store`'
      ],
      added: [
        '**plugin**. Published new package `@edtr-io/plugin` intended to be used by plugin authors. It exposes `Plugin`, `PluginEditorProps`, `StatelessPluginEditorProps`, `StatefulPlugin`, `StatelessPlugin` and (flatly) everything that was previously exported as `StateType`.',
        '**store**. Published new package `@edtr-io/store`. It (flatly) exposes actions and selectors, and all previous store exports that are mostly for special use cases.'
      ],
      changed: [
        `**store**. The signatures of selectors have been unified. Every selector is now a function (with any number of parameters) and returns a function that accepts the scoped state (and returns any type of return value):
\`\`\`.js
import { getDocument, getPlugin, getRoot } from '@edtr-io/store'
useScopedSelector(getRoot())
useScopedSelector(getDocument('some-id'))
useScopedSelector(state => {
  const document = /* do something */ null
  return document && getPlugin(document.plugin)(state)
})\`\`\``,
        "**editor-ui**. Doesn't have to be a `peerDependency` anymore",
        "**renderer-ui**. Doesn't have to be a `peerDependency` anymore",
        "**ui**. Doesn't have to be a `peerDependency` anymore"
      ]
    },
    {
      tagName: 'v0.10.1',
      name: '0.10.1',
      date: '2019-09-11',
      added: ['**plugin-image**. Show upload status of images'],
      changed: [
        '**plugin-image**. Better error messages',
        '**plugin-rows**. Improved performance',
        '**plugin-text**. Improved performance',
        '**plugin-text**. Improved math formulas (e.g. better error messages, responsive block formulas)'
      ],
      fixed: [
        '**editor-ui**. Fix background color in default editor theme',
        '**plugin-text**. Split on enter now works also when there is a list in the same block.'
      ]
    },
    {
      tagName: 'v0.10.2',
      name: '0.10.2',
      date: '2019-09-11',
      fixed: ['**store**. Specify return type of `serializeRootDocument`']
    },
    {
      tagName: 'v0.10.3',
      name: '0.10.3',
      date: '2019-09-13',
      fixed: ['**plugin-text**. Various fixes (updated Slate)']
    },
    {
      tagName: 'v0.11.0',
      name: '0.11.0',
      date: '2019-09-16',
      breakingChanges: [
        '**plugin**. Refactored `StateType` API. This should only affect you if you defined custom state types.',
        '**plugin**. Consistently renamed `StateDescriptor*` types to `StateType*`',
        '**plugin**. `StatelessPluginEditorProps` and `PluginEditorProps` no longer accept the type param `Props`. Replace `StatelessPluginEditorProps<Props>` with `StatelessPluginEditorProps & Props`.',
        '**plugin**. `StatelessPlugin` may no longer define `getFocusableChildren`. This is handled by state types instead.',
        '**plugin**. The return type of the built-in `child` state type is no longer callable. Replace `state()` with `state.get()` or `state.id` to retrieve the `id`.',
        "**plugin**. The return type of the built-in `list` state type is no longer callable and doesn't expose `items` anymore. Instead, the return types behaves like an array itself. Replace `state()` resp. `state.items` with `state`.",
        '**plugin**. The return type of the built-in `object` state type is no longer callable. Replace `state()` with `state`.',
        '**plugin**. The return type of the built-in scalar state types (i.e. `boolean`, `number`, `string`, `scalar`, `serializedScalar`) is no longer callable. Replace `state()` with `state.get()` or `state.value`.',
        '**plugin**. The return type of the built-in `upload` state type is no longer callable. Replace `state()` with `state.get()` or `state.value`.'
      ],
      added: [
        '**plugin**. The return type of the built-in scalar state types (i.e. `boolean`, `number`, `string`, `scalar`, `serializedScalar`) now allows to set the value. Instead of `state.set("foo")`, you may now also use `state.value = "foo"`.',
        '**store**. Add new selector `hasFocusedChild` that checks whether the given document has any (direct) child that is focused',
        '**store**. Add new selector `hasFocusedDescendant` that checks whether the given document has any descendant that is focused (i.e. also recursively checks children of children)'
      ]
    },
    {
      tagName: 'v0.11.1',
      name: '0.11.1',
      date: '2019-09-18',
      fixed: ['**core**. Documents no longer lose focus during editing']
    },
    {
      tagName: 'v0.11.2',
      name: '0.11.2',
      date: '2019-09-26',
      fixed: [
        '**core**. `onChange` callback prop of `Editor` is now working again',
        '**plugin-text**. Updated slate types to newest version 0.47.1.',
        '**plugin-text**. Fix suggestions for inserting plugins after typing `/`.'
      ],
      changed: [
        '**plugin-input-exercise**. Changed state and ui to be more consistent with `plugin-sc-mc-exercise`'
      ]
    },
    {
      tagName: 'v0.11.3',
      name: '0.11.3',
      date: '2019-09-27',
      fixed: [
        '**plugin-input-exercise**. Use `migratable` in state for backwards compatibility with pre v0.11.2 state',
        '**plugin-sc-mc-exercise**. Fixed server side rendering',
        '**plugin-text**. Fixed server side rendering',
        '**renderer-ssr**. Tests now test for correct results additionally to working server side rendering.'
      ]
    },
    {
      tagName: 'v0.12.0',
      name: '0.12.0',
      date: '2019-10-14',
      breakingChanges: [
        '**renderer-ui**. Removed `title` prop in `ExpandableBox`. Use the new `renderTitle` prop instead.'
      ],
      added: [
        '**editor-ui**. Add new component `OverlaySelect`',
        '**plugin**. Add prop `defaultFocusRef` for plugins that should be passed as `ref` to the input element that should be focused initially when the plugin gets focused',
        '**plugin-video**. Add alt text'
      ],
      fixed: [
        '**core**. Hot keys handler considers the correct state for deleting empty plugins',
        '**core**. Fix focus movement with arrow keys',
        '**plugin-rows**. Make extended settings scrollable',
        '**plugin-serlo-injection**. Automatically resize iframe when content or window height changes',
        '**plugin-serlo-injection**. Reduce content jumps by lazily loading iframes'
      ],
      changed: [
        '**plugin-input-exercise**. Add units to input exercises',
        '**plugin-text**. Heading button opens sub menu even when the block is already a heading',
        '**plugin-text**. Focus empty LaTeX textarea on mount initially',
        '**renderer-ui**. Open `ExpandableBox` initially'
      ],
      removed: [
        '**plugin-hint**. Remove title',
        '**plugin-solution**. Remove title'
      ]
    }
  ])

  await writeFile(path.join(__dirname, '..', 'CHANGELOG.md'), content)
}
