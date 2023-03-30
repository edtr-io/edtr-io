import { generateChangelog } from '@inyono/changelog'
import * as fs from 'fs'
import * as path from 'path'
import { fileURLToPath } from 'url'
import * as util from 'util'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const writeFile = util.promisify(fs.writeFile)

exec()
  .then(() => {
    process.exit(0)
  })
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })

async function exec(): Promise<void> {
  const content = generateChangelog({
    repository: {
      firstCommit: '723fb79110bdeec83889a6d6bc617ce2d455d4ff',
      owner: 'edtr-io',
      repo: 'edtr-io',
    },
    releases: [
      {
        tagName: 'v0.1.0',
        name: '0.1.0',
        date: '2019-02-08',
        description: 'Initial release',
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
          'Plugins no longer receive `onChange`. Use the provided setters & helpers on `state` instead',
        ],
        added: [
          'Handle serialization and deserialization of documents',
          'Add `<Editor />` that replaces `<EditorProvider />`',
          'Add `StateType.scalar` that represents a value of the given type (more specifically: `StateType.boolean`, `StateType.number`, `StateType.child`',
          'Add `StateType.list`, `State.object`',
          'Add slate for rich text and links. Standard Bold + Italic hotkeys supported.',
        ],
        changed: ['Rename `createDocumentIdentifier` to `createDocument`'],
        removed: ['Remove `<EditorProvider />` in favor of `<Editor />`'],
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
          'Added `changed` callback to Editor. The callback is called on every Action passing a boolean if the content changed since the last `PersistAction` was dispatched.',
        ],
      },
      {
        tagName: 'v0.3.0',
        name: '0.3.0',
        date: '2019-03-08',
        added: ['Added a menu for selecting a plugin on insert to rows plugin'],
        changed: [
          'State Descriptors uniformly return their value/items/object by invoking the state.',
        ],
        fixed: [
          'Only trigger `changed` if the number of pending changes changed',
        ],
        breakingChanges: [
          'Removed `DocumentIdentifier`. You should pass the state to `<Editor />` instead',
          'Removed `state` prop from `Document`. You should pass only the id as `id` prop instead.',
          'Removed `value` property from `StateType.object`. The values are now exposed directly on `[key]`.',
        ],
      },
      {
        tagName: 'v0.3.1',
        name: '0.3.1',
        date: '2019-03-13',
        added: [
          'Add move Up/Down functionality to Rows plugin',
          'Add clipboard to rows plugin add-menu',
          'Add Cut / Copy actions to Rows plugin',
          'GeoGebra plugin',
        ],
        changed: [
          '**plugin-spoiler**. Remove input element in render mode',
          'Settings Overlay now closes with click outside of the modal',
        ],
        fixed: ["**plugin-text**. Don't dispatch selection changes anymore"],
      },
      {
        tagName: 'v0.3.2',
        name: '0.3.2',
        date: '2019-03-14',
        added: [
          'Added Image plugin',
          'Added `editable` prop to `Editor` for switching between edit and render mode',
          'Added optional `onPaste` callback to plugins, which is called by the text plugin on paste event',
        ],
      },
      {
        tagName: 'v0.4.0',
        name: '0.4.0',
        date: '2019-03-21',
        breakingChanges: [
          'Moved rows plugin from `@edtr-io/ui` to `@edtr-io/plugin-rows`',
          'Replaced `showOverlay` and `hideOverlay` with an `OverlayContext`',
        ],
        added: [
          'Added `InlineOverlay` component for plugin controls',
          'Added focus previous / focus next actions',
          'Added optional `getFocusableChildren` to stateful plugins, which is used to resolve the previous / next focusable child',
        ],
        changed: ['**plugin-text**. Handle focus when using arrow keys'],
        fixed: [
          '**plugin-text**. Focus / blur slate depending on `props.focused`',
        ],
      },
      {
        tagName: 'v0.4.1',
        name: '0.4.1',
        date: '2019-03-22',
        added: ['Use Theming in toolbars and menus.'],
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
          '**plugin-video**. Added video plugin',
        ],
        fixed: [
          '**core**. Handle focus in nested documents correctly',
          '**plugin-rows**. Align top and bottom add butons correctly in custom integrations',
          '**plugin-text**. Disable slate undo/redo',
          '**plugin-text**. Refocus after undo/redo',
        ],
        internal: [
          '**demo**. Plugins available to the demo storybook are now defined in `demo/src/plugins.tsx`',
          '**demo**. Added `build-demo` task that builds the demo storybook (and deploys it automatically to Netlify). The demo of the master branch is available on https://demo.edtr.io',
          '**demo**. Brand the demo storybook',
        ],
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
          '**plugin-text**. Merge with previous / next text plugin on backspace / delete when at start / end of plugin',
        ],
        fixed: [
          '**plugin-geogebra**. Scale applet with container size preserving aspect ratio',
          '**plugin-geogebra**. Accept full GeoGebra material link too',
          '**plugin-image**. Center image',
          '**plugin-text**. Display Link-Overlay only when plugin is focused',
          '**plugin-text**. Refocus after bold/italic button click',
        ],
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
          '**ui**. Moved renderer ui elements (e.g. `ExpandableBox`) to the new package `@edtr-io/renderer-ui`',
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
          '**plugin-text**. Leave nested Text-Plugins on second Enter key press',
        ],
        changed: [
          '**plugin-text**. Hide placeholder in render mode',
          '**plugin-text**. Hovering Menu for text formatting',
          '**plugin-text**. Styling of inline-overlay improved',
          '**ui** / **editor-ui** / **renderer-ui**. Revised theming workflow',
          '**ui**. reworked the ui of several plugins (image, video, anchor, geogebra, h5p, highlight, hint, solution and spoiler)',
          '**plugin-rows**. Improved styling of add menu and controls',
          '**core**. Add new text plugin on Enter and delete empty plugins on backspace and delete',
        ],
        fixed: ['**plugin-image**. Hide config-overlay in render mode'],
        internal: [
          '**demo**. Log errors only',
          '**demo**. Add additional examples for plugin-usage in Storybook',
        ],
      },
      {
        tagName: 'v0.6.0',
        name: '0.6.0',
        date: '2019-05-22',
        breakingChanges: [
          '**core**. Requires additional peer-dependencies `react-dnd@^7.0.0` and `react-dnd-html5-backend@^7.0.0`',
        ],
        added: [
          "**core**. Editor accepts a new boolean prop `omitDragDropContext`. If set to `true`, the editor won't render `react-dnd`'s  `DragDropContextProvider`",
          '**plugin-files**. Add plugin for file uploads',
          '**plugin-rows**. Pass `renderIntoExtendedSettings` and `PrimarySettings` as props to children',
          '**plugin-text**. Poweruser-Feature: Add new plugins with /[plugintitle] in editmode',
        ],
        changed: [
          '**plugin-rows**. Adapt styles and controls implemented by schul-cloud, including drag&drop',
          '**plugin-rows**. Add full color theming support',
        ],
        fixed: [
          '**plugin-text**. Fix key conflicts of merge and remove on backspace ([#123](https://github.com/edtr-io/edtr-io/issues/123))',
          '**plugin-spoiler**, **plugin-solution**, **plugin-hint**, **plugin-equations**. Make children traversable',
        ],
      },
      {
        tagName: 'v0.6.1',
        name: '0.6.1',
        date: '2019-06-13',
        breakingChanges: [
          '**plugin-image**. Changed configs for createImagePlugin and removed Upload export',
        ],
        added: ['**core**. Added StateType upload for file uploading.'],
      },
      {
        tagName: 'v0.6.2',
        name: '0.6.2',
        date: '2019-06-19',
        deprecated: [
          '**plugin-rows**. PrimarySettingsWrapper from props passed to children is now deprecated, use PrimarySettings from editor-ui instead.',
        ],
        added: [
          '**editor-ui**. Add component PrimarySettings. Use this to wrap Settings displayed directly in page for common styling.',
        ],
        fixed: [
          '**plugin-image**. Do not lose focus in PrimarySettings',
          '**plugin-image**. Display Placeholder on empty image',
        ],
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
          '**plugin-rows**. Deprecated PrimarySettingsWrapper now removed. Use PrimarySettings from package editor-ui instead.',
        ],
        added: [
          '**core**. To connect to the store, you can either use the exposed `useStore` or our newly exposed `connect` and `connectStateOnly`. If you want to connect to all editor instances use `EditorContext` (e.g. with `React.useContext`)',
          '**core**. Exposes a new Component `Document` that has to be rendered into an `EditorProvider`. In contrast to `Editor`, it accepts an additional prop `scope` and is not editable by default. Documents sharing the same scope use the same store state.',
        ],
        fixed: [
          '**core**. Various fixes to history handling (e.g. resetting to the last persisted state after undoing the last change)',
          '**plugin-text**. Fix positioning of text controls on touch devices',
        ],
        removed: [
          "**plugin-h5p**. Since our `serlo.h5p.com` trial expired, we don't publish `@edtr-io/h5p-plugin` anymore",
        ],
        changed: [
          'Various performance improvements',
          '**core**. The exposed hooks now optionally accept the scope. If it is not provided, it uses the scope of the parent `Editor`',
        ],
        internal: [
          '**core**. Use `redux` & `redux-saga` instead of `React.useReducer`. Since we are passing our own context to `redux`, you can still use `redux` in your own application. The store should be considered as an implementation detail',
          '**core**. Replace `uuid` with `shortid`',
        ],
      },
      {
        tagName: 'v0.7.1',
        name: '0.7.1',
        date: '2019-07-21',
        changed: [
          'Optimize bundle size',
          '**plugin-rows**. add-button is now always visible under the focused document',
        ],
        added: [
          '**core**. Add `StateType.migratable` that allows to update plugin state structure without breaking changes',
          '**plugin-important-statement**. Plugin that highlights important statements.',
          '**plugin-serlo-injection**. Add plugin for injecting serlo.org content',
          '**plugin-table**. Add plugin for markdown tables',
        ],
        fixed: ['**plugin-text**. Split plugin when pasting multiple blocks'],
      },
      {
        tagName: 'v0.8.0',
        name: '0.8.0',
        date: '2019-08-01',
        breakingChanges: [
          'When using the newly exposed `<Renderer />`, `defaultPlugin` is no longer set to an actual plugin. So you should only rely on `defaultPlugin` in an editable environment (e.g. to decide which plugin to insert by default) and only pass complete serialized Edtr.io documents to `<Renderer />`.',
          "**plugin-text**. We no longer import KaTeX's stylesheet to not depend on a CSS-capable bundler. Please include the stylesheet yourself.",
        ],
        added: [
          '**renderer**. Expose `<Renderer />` that renders a Edtr.io document with the given plugins with React. We plan to optimize its bundle size to minimize loading times for use cases where no editor is needed. Also, we plan to provide smaller renderer bundles for some of our plugins (e.g. text plugin)',
          '**renderer-ssr**. Expose `render` that server-side renders a Edtr.io document with the given plugins and returns `{ styles, html }`.',
          '**plugin-text**. Add possibility to write inline-code via CTRL+Q',
        ],
        changed: [
          '**plugin-text**. Make plugin capable to be rendered server-side',
        ],
        fixed: [
          '**plugin-important-statement**. Actually build the plugin before publishing',
        ],
        internal: [
          'Tests in `__tests-ssr__` folders are executed `node` environment to test SSR (in contrast to tests in `__tests__` folders that are executed in a browser-like environment)',
        ],
      },
      {
        tagName: 'v0.8.1',
        name: '0.8.1',
        date: '2019-08-09',
        fixed: [
          '**core**. Fix `StateType.upload`',
          '**core**. Export `MigratableStateDescriptor`',
          "**plugin-rows**. Add menu doesn't jump to the top of the root document anymore",
        ],
      },
      {
        tagName: 'v0.8.2',
        name: '0.8.2',
        date: '2019-08-14',
        changed: [
          'Various naming improvements',
          'Various small UX improvements',
        ],
        fixed: [
          'Add missing dependencies in various packages',
          '**core**. Review public API. For example, `useScopedStore` is now correctly part of the public API.',
        ],
        internal: [
          'Enable eslint rules to enforce consistency in our import statements (automatically fixable with `yarn format`)',
          'Enable eslint rules that warn for common errors in imports (e.g. missing dependencies, ...)',
        ],
      },
      {
        tagName: 'v0.8.3',
        name: '0.8.3',
        date: '2019-08-22',
        changed: [
          '**plugin-equations**. Heavily simplified for first release',
          '**plugin-sc-mc-exercise**. Complete redesign',
        ],
        fixed: [
          '**plugin-highlight**. Handle arrow keys and enter within textarea',
          '**plugin-rows**. Show add button when no children exist',
          '**plugin-table**. Handle arrow keys and enter within textarea',
        ],
      },
      {
        tagName: 'v0.9.0',
        name: '0.9.0',
        date: '2019-08-24',
        breakingChanges: [
          '**core**. `createStore` has a new required option `createStoreEnhancer`. Our high-level API (e.g. `<Editor />`, `<EditorProvider />` and `<Renderer />`) handle that change in a non-breaking way, though.',
        ],
        added: ['**core**. Expose `getUndoStack` and `getRedoStack` selectors'],
        changed: [
          '**core**. Store no longer applies enhancers used for testing or development purposes. Instead,  `<Editor />`, `<EditorProvider />` and `<Renderer />` provide a new optional prop `createStoreEnhancer` that allows to extend the store enhancer used. Our previous enhancer for development is published as a new package `@edtr-io/store-devtools` (e.g. used in our demo).',
        ],
      },
      {
        tagName: 'v0.9.1',
        name: '0.9.1',
        date: '2019-08-24',
        description:
          "Redeployment of previous release since some types weren't published correctly.",
      },
      {
        tagName: 'v0.9.2',
        name: '0.9.2',
        date: '2019-08-25',
        added: [
          '**plugin-text**. Make available plugins customizable via new export `createTextPlugin`',
          '**plugin-rows**. Make available plugins customizable via new export `createRowsPlugin`',
        ],
      },
      {
        tagName: 'v0.9.3',
        name: '0.9.3',
        date: '2019-08-29',
        added: [
          '**plugin-table**. Add placeholder for empty tables',
          '**plugin-text**. Fixed persisting of math formulas',
        ],
      },
      {
        tagName: 'v0.9.4',
        name: '0.9.4',
        date: '2019-08-30',
        added: [
          '**core**. Editor is now able to recover from errors. If any error is thrown in the subtree, the respective `<Document />` offers users to undo their last change. Furthermore, `<Editor />` now accepts an optional `onError` prop that gets called with the thrown error.',
          '**plugin-rows**. Open plugin menu only when the respective button got clicked (instead of making the whole row clickable)',
          '**plugin-sc-mc-exercise**. Display a preview in edit mode and simplify focusing of exercises.',
        ],
      },
      {
        tagName: 'v0.9.5',
        name: '0.9.5',
        date: '2019-09-04',
        added: [
          '**plugin-sc-mc-exercise**. Make preview overlay not editable',
          '**plugin-table**. Allow overriding of markdown renderer via newly exported `createTablePlugin`',
        ],
      },
      {
        tagName: 'v0.9.6',
        name: '0.9.6',
        date: '2019-09-06',
        added: [
          '**plugin-text**. Remember math mode preference (visual vs. LaTeX)',
        ],
        changed: ['**core**. Improve performance'],
      },
      {
        tagName: 'v0.9.7',
        name: '0.9.7',
        date: '2019-09-06',
        description:
          "Redeployment of previous release since some types weren't published correctly.",
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
          '**core**. Moved all store exports (e.g. `createStore`) to the new package `@edtr-io/store`',
        ],
        added: [
          '**plugin**. Published new package `@edtr-io/plugin` intended to be used by plugin authors. It exposes `Plugin`, `PluginEditorProps`, `StatelessPluginEditorProps`, `StatefulPlugin`, `StatelessPlugin` and (flatly) everything that was previously exported as `StateType`.',
          '**store**. Published new package `@edtr-io/store`. It (flatly) exposes actions and selectors, and all previous store exports that are mostly for special use cases.',
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
          "**ui**. Doesn't have to be a `peerDependency` anymore",
        ],
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
          '**plugin-text**. Improved math formulas (e.g. better error messages, responsive block formulas)',
        ],
        fixed: [
          '**editor-ui**. Fix background color in default editor theme',
          '**plugin-text**. Split on enter now works also when there is a list in the same block.',
        ],
      },
      {
        tagName: 'v0.10.2',
        name: '0.10.2',
        date: '2019-09-11',
        fixed: ['**store**. Specify return type of `serializeRootDocument`'],
      },
      {
        tagName: 'v0.10.3',
        name: '0.10.3',
        date: '2019-09-13',
        fixed: ['**plugin-text**. Various fixes (updated Slate)'],
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
          '**plugin**. The return type of the built-in `upload` state type is no longer callable. Replace `state()` with `state.get()` or `state.value`.',
        ],
        added: [
          '**plugin**. The return type of the built-in scalar state types (i.e. `boolean`, `number`, `string`, `scalar`, `serializedScalar`) now allows to set the value. Instead of `state.set("foo")`, you may now also use `state.value = "foo"`.',
          '**store**. Add new selector `hasFocusedChild` that checks whether the given document has any (direct) child that is focused',
          '**store**. Add new selector `hasFocusedDescendant` that checks whether the given document has any descendant that is focused (i.e. also recursively checks children of children)',
        ],
      },
      {
        tagName: 'v0.11.1',
        name: '0.11.1',
        date: '2019-09-18',
        fixed: ['**core**. Documents no longer lose focus during editing'],
      },
      {
        tagName: 'v0.11.2',
        name: '0.11.2',
        date: '2019-09-26',
        fixed: [
          '**core**. `onChange` callback prop of `Editor` is now working again',
          '**plugin-text**. Updated slate types to newest version 0.47.1.',
          '**plugin-text**. Fix suggestions for inserting plugins after typing `/`.',
        ],
        changed: [
          '**plugin-input-exercise**. Changed state and ui to be more consistent with `plugin-sc-mc-exercise`',
        ],
      },
      {
        tagName: 'v0.11.3',
        name: '0.11.3',
        date: '2019-09-27',
        fixed: [
          '**plugin-input-exercise**. Use `migratable` in state for backwards compatibility with pre v0.11.2 state',
          '**plugin-sc-mc-exercise**. Fixed server side rendering',
          '**plugin-text**. Fixed server side rendering',
          '**renderer-ssr**. Tests now test for correct results additionally to working server side rendering.',
        ],
      },
      {
        tagName: 'v0.12.0',
        name: '0.12.0',
        date: '2019-10-14',
        breakingChanges: [
          '**renderer-ui**. Removed `title` prop in `ExpandableBox`. Use the new `renderTitle` prop instead.',
        ],
        added: [
          '**editor-ui**. Add new component `OverlaySelect`',
          '**plugin**. Add prop `defaultFocusRef` for plugins that should be passed as `ref` to the input element that should be focused initially when the plugin gets focused',
          '**plugin-video**. Add alt text',
        ],
        fixed: [
          '**core**. Hot keys handler considers the correct state for deleting empty plugins',
          '**core**. Fix focus movement with arrow keys',
          '**plugin-rows**. Make extended settings scrollable',
          '**plugin-serlo-injection**. Automatically resize iframe when content or window height changes',
          '**plugin-serlo-injection**. Reduce content jumps by lazily loading iframes',
        ],
        changed: [
          '**plugin-input-exercise**. Add units to input exercises',
          '**plugin-text**. Heading button opens sub menu even when the block is already a heading',
          '**plugin-text**. Focus empty LaTeX textarea on mount initially',
          '**renderer-ui**. Open `ExpandableBox` initially',
        ],
        removed: [
          '**plugin-hint**. Remove title',
          '**plugin-solution**. Remove title',
        ],
      },
      {
        tagName: 'v0.13.0',
        name: '0.13.0',
        date: '2019-12-20',
        breakingChanges: [
          `
All core plugins now consistently export \`createFooPlugin()\`, \`FooState\` and \`FooProps\`. The factory
\`createFooPlugin()\` accepts a (sometimes optional) config depending on the plugin.
        `,
          `
Plugins now receive their config via a new prop \`config\`. Furthermore, they need to specify their config in their definition.
        `,
          `
Packages that are only intended for internal use are now consistently named \`@edtr-io/internal__\${name}\`.
We don't consider these packages as part of the public API and therefore won't note their potential breaking
changes in the future. More specifically, this means that the following packages have been removed:
- \`@edtr-io/abstract-plugin\`,
- \`@edtr-io/abstract-plugin-state\`
- \`@edtr-io/bundle-size\`,
- \`@edtr-io/demo\`,
- \`@edtr-io/fixtures\`
        `,
          `
Plugins no longer receive the prop \`renderIntoExtendedSettings\` (that was only passed down to direct children
of the rows plugin). Instead, please use the new prop \`renderIntoSettings\` that now all documents receive.
        `,
          '**core**, **plugin-rows**. We now have a peer dependency on `react-dnd@^10.0.0` and `react-dnd-html5-backend@^10.0.0` (both `^7.0.0` previously)',
          '**core**. Removed `OverlayContext` and `OverlayContextValue`.',
          '**editor-ui**. Moved `OverlayButton`, `OverlayCheckbox`, `OverlayInput`, `OverlaySelect`, `OverlayTextarea` into `@edtr-io/core`',
          '**editor-ui**. Moved icons into `@edtr-io/ui`',
          '**editor-ui**. Removed `SettingsOverlay`',
          '**plugin** Removed `StatelessPlugin`, `StatefulPlugin`, `StatelessPluginProps`, `StatefulPluginProps`. Use `EditorPlugin` and `EditorPluginProps` instead',
          '**ui**. Removed `OverlayTheme`',
          '**ui**. Removed `plugins` from `CustomTheme`. Instead, all core plugins that allowed to customize their theme now accept the theme via their config.',
        ],
        added: [
          `
There are now more parts of the editor's UI configurable. More specifically, we moved the following components in the core:
- **Plugin Toolbar**.
    The plugin toolbar is responsible for rendering the buttons that are shown on the left of focused documents by default.
    Furthermore, it is responsible for rendering any overlays that the toolbar buttons might open (e.g. the plugin settings).
    Plugins may override the toolbars of their children (e.g. the rows plugin adds a drag handler) and their settings (e.g.
    the rows plugin adds a delete and copy button to the settings of its children).

    You may override the looks of the plugin toolbar completely by passing your own implementation as the new optional prop
    \`PluginToolbar\` to \`Editor\`. By default we use \`@edtr-io/default-plugin-toolbar\`.
- **Document Editor**.
    The document editor is responsible for rendering the plugin toolbar and possible additional editor UI elements
    that are application-specific.

    You may override the default behavior completely by passing your own \`DocumentEditor\` to \`Editor\`. By default, we use
    \`@edtr-io/default-document-editor\`
        `,
          '**core**. Added `PluginToolbarButton, `PluginToolbarOverlayButton` that are intended to be passed by plugins into `renderToolbar`',
          '**core**. Added selectors `getFocused`, `isFocused`',
          '**plugin**. The change handler of state types allows to pass an optional second argument that allows state types to handle asynchronous state updates that should be committed only once',
          '**ui**. Added `BottomToolbarTheme` to `EditorUiTheme`',
          '**plugin-multimedia-explanation**. New plugin that allows to position multimedia content (e.g. images, video) beside the content',
          '**plugin-text**. Deserialize pasted HTML into corresponding text state if possible',
          '**plugin-text**. Automatically transform urls into links',
          '**plugin-text**. Add protocol `https` to urls without protocol',
        ],
        fixed: [
          '**editor-ui**. Position `PreviewOverlay` over content',
          '**plugin-text**. Correctly render colored text on server',
          '**core**. Improved undo/redo behavior for asynchronous changes (e.g. file uploads)',
        ],
      },
      {
        tagName: 'v0.13.1',
        name: '0.13.1',
        date: '2020-01-04',
        added: [
          'Plugins receive new prop `renderIntoToolbar` to render toolbar buttons',
        ],
        fixed: [
          '**store**. `serializeDocument` no longer returns a new object in every call',
        ],
      },
      {
        tagName: 'v0.13.2',
        name: '0.13.2',
        date: '2020-01-07',
        fixed: ['**core**. Show toolbar if `renderIntoToolbar` was called'],
      },
      {
        tagName: 'v0.13.3',
        name: '0.13.3',
        date: '2020-01-13',
        fixed: ['**plugin-highlight**. Fix server-side rendering'],
      },
      {
        tagName: 'v0.13.4',
        name: '0.13.4',
        date: '2020-01-14',
        added: [
          'Accept the newly released styled-components v5 additionally to v4 as peer dependency',
        ],
      },
      {
        tagName: 'v0.13.5',
        name: '0.13.5',
        date: '2020-01-14',
        fixed: [
          'Various improvements & fixes in the TypeScript declaration files',
        ],
      },
      {
        tagName: 'v0.13.6',
        name: '0.13.6',
        date: '2020-01-15',
        fixed: [
          '**plugin-rows**. Improve drag and drop, handle drag and drop between multiple documents correctly',
        ],
      },
      {
        tagName: 'v0.13.7',
        name: '0.13.7',
        date: '2020-01-20',
        fixed: ['**plugin-rows**. Fix drag and drop in Chrome'],
      },
      {
        tagName: 'v0.14.0',
        name: '0.14.0',
        date: '2020-01-23',
        breakingChanges: [
          'Plugins no longer receive `insert`, `remove`, `replace`, `mergeWithPrevious`, `mergeWithNext` via plugin props. Please use the new actions and selectors instead. If you wrote a plugin that provided those, implement the new `insertChild` and `removeChild`.',
          "Plugins no longer receive their parents' plugin props. Please use the store instead if you need to access your parents somehow.",
          'Plugins no longer receive their name. Please get your document from the store if you really need that',
          'For consistency, plugins receive the `StateTypeReturnType` in the optional `isEmpty` instead of their `StateTypeValueType`',
          "**plugin**. State types no longer receive the plugin props. This was only used by `child` anyways to handle the parents' plugin props.",
          '**plugin-text**. The blockquote controls will only be shown if the type of the blockquote plugin is provided via plugin config.',
        ],
        added: [
          '**store**. Add `wrap` and `unwrap` actions',
          '**store**. Add `replace` action',
          '**store**. Add `insertChildAfter`, `insertChildBefore` and `removeChild` actions',
          '**store**. Add `getParent` selector',
          '**store**. Add `mayInsertChild` and `mayRemoveChild` selector',
        ],
        fixed: [
          '**store**. When undoing resp. redoing, replace the state only once',
        ],
      },
      {
        tagName: 'v0.50.0',
        name: '0.50.0',
        date: '2020-01-27',
        description:
          "This release cleans up the plugin states for the soon-ish 1.0.0 release. Note that this contains breaking changes in the serialized states so you'll need to migrate any persisted Edtr.io states. As far as we know, this concerns only Serlo so far. Please get in touch if this affects you, too, and we gladly help with migrating.",
        breakingChanges: [
          "**plugin-equations**. Remove `@edtr-io/plugin-equations`. We'll experiment with that plugin at Serlo and might publish it as an Edtr.io plugin in the future again.",
          `**plugin-files**. Breaking change in serialized state:
- Rename \`location\` to \`src\`
`,
          `**plugin-highlight**. Breaking changes in serialized state:
- Rename \`text\` to \`code\`
- Rename \`lineNumbers\` to \`showLineNumbers\`
`,
          '**plugin-hint**. Remove `@edtr-io/plugin-hint`. Please build your own domain-specific plugins using `ExpandableBox` in `@edtr-io/renderer-ui`.',
          `**plugin-image**. Breaking changes in serialized state:
- Combine \`href\`, \`target\` and \`rel\` into the new optional object \`link\` with properties \`href\` and \`openInNewTab\`
- Rename \`description\` to \`alt\` and made it optional
- Make \`maxWidth\` optional
`,
          '**plugin-important-statement**. Remove `@edtr-io/plugin-important-statement`',
          `**plugin-input-exercise**. Breaking change in serialized state:'
- Remove migratable, i.e. accept only the latest state
`,
          `**plugin-sc-mc-exercise**. Breaking change in serialized state:
- Rename \`id\` to \`content\`
- Remove \`hasFeedback\`
`,
          '**plugin-solution**. Remove `@edtr-io/plugin-solution`. Please build your own domain-specific plugins using `ExpandableBox` in `@edtr-io/renderer-ui`.',
          `**plugin-text**. Breaking change in serialized state:
- Use slate 0.50+ state for serialization so that we can upgrade to slate 0.50+ after releasing 1.0.0 in a non-breaking way. You can use the newly exported \`serializer.serialize\` to migrate old slate states.
`,
          `**plugin-video**. Breaking changes in serialized state:
- Remove migratable, i.e. accept only the latest state
`,
        ],
        added: [
          '**plugin**. Add new state type `optional` to work with optional values.',
        ],
      },
      {
        tagName: 'v0.51.0',
        name: '0.51.0',
        date: '2020-02-05',
        breakingChanges: [
          "**renderer**. The renderer doesn't accept a store enhancer anymore",
        ],
        fixed: [
          '**plugin-sc-mc-exercise**. Resolve focus issues',
          '**plugin-text**. Resolve focus issues',
          '**plugin-text**. Provide our own types for slate, slate-html-serializer and slate-react',
          '**renderer**. Provide specialized store for the renderer',
        ],
      },
      {
        tagName: 'v0.51.1',
        name: '0.51.1',
        date: '2020-02-09',
        fixed: [
          '**default-document-editor**. Create `BorderlessOverlayButton` statically',
        ],
      },
      {
        tagName: 'v0.51.2',
        name: '0.51.2',
        date: '2020-02-14',
        internal: [
          '**plugin-text**. Export `slateValueToHtml` and `htmlToSlateValue` as internal API',
        ],
      },
      {
        tagName: 'v0.51.3',
        name: '0.51.3',
        date: '2020-02-14',
        fixed: ['**plugin-text**. Update dependencies'],
      },
      {
        tagName: 'v0.52.0',
        name: '0.52.0',
        date: '2020-02-18',
        description:
          'This release cleans up the public API for the upcoming 1.0.0 release.',
        fixed: [
          '**store**. The property `state` of `DocumentState` is now correctly marked as required',
          '**ui**. The property `editorUi` of `EditorThemeProps` and `useEditorTheme` is now correctly typed as `DeepPartial<EditorUiTheme>`',
          '**ui**. The property `rendererUi` of `RendererThemeProps` and `useRendererTheme` is now correctly typed as `DeepPartial<RendererUiTheme>`',
          '**ui**. `DeepPartial` now correctly works with function types',
        ],
        breakingChanges: [
          `We removed the concept of \`defaultPlugin\` from the core and moved it into the plugins instead. This way, each plugin can configure its own default plugin(s) and it's more clear where we require a plugin to bet set:
- **core**. \`EditorProps\` no longer accepts \`defaultPlugin\` and now requires \`initialState\` (which could be \`{"plugin":"rows"}\` in the simplest case)
- **core**. \`Document\` now requires \`initialState\` if it is not a mirror
- **plugin**. The \`child\` state type now requires \`plugin\` to bet set
- **plugin**  \`child.replace\` now requires \`plugin\` to be set'
- **plugin**. The \`createDocument\` helper for deserialization of state type values now requires \`plugin\` to be set. This should only affect if you if you wrote your own custom state type
- **plugin-blockquote**. Plugin config now requires the newly added \`content\` that specifies which plugin should be used for the content
- **plugin-input-exercise**. Plugin config now requires \`feedback\` that specifies which plugin should be used for the feedback
- **plugin-multimedia-explanation**. Plugin config now requires the newly added \`explanation\` that specifies which plugin should be used for the explanation
- **plugin-rows**. Plugin config now requires the newly added \`content\` that specifies which plugin should be used for the content
- **plugin-sc-mc-exercise**. Plugin config now requires the newly added \`content\` resp. \`feedback\` that specifies which plugin should be used for the content resp. feedback
- **plugin-spoiler**. Plugin config now requires the newly added \`content\` that specifies which plugin should be used for the content
- **store**. Removed \`getDefaultPlugin\`, \`getPluginOrDefault\`, \`getPluginTypeOrDefault\`
- **store**. Removed \`defaultPlugin\` from \`State["plugins"]\` and remove the no longer needed nesting
- **store**. Removed \`defaultPlugin\` from \`StoreOptions["scopes"]\` and remove the no longer needed nesting
- **store**. \`InitRoot\` now requires \`plugin\` to be set
`,
          `We added internationalization support. All strings should now be in English by default and should be (optionally) configurable (feel free to create an issue if we missed some):
- **plugin-anchor**. Plugin config now accepts an optional \`i18n\` attribute that allows to override the strings used
- **plugin-files**. Plugin config now accepts an optional \`i18n\` attribute that allows to override the strings used
- **plugin-geogebra**. Plugin config now accepts an optional \`i18n\` attribute that allows to override the strings used
- **plugin-highlight**. Plugin config now accepts an optional \`i18n\` attribute that allows to override the strings used
- **plugin-image**. Plugin config now accepts an optional \`i18n\` attribute that allows to override the strings used
- **plugin-input-exercise**. Plugin config now accepts an optional \`i18n\` attribute that allows to override the strings used
- **plugin-multimedia-explanation**. Plugin config now accepts an optional \`i18n\` attribute that allows to override the strings used
- **plugin-rows**. Plugin config now accepts an optional \`i18n\` attribute that allows to override the strings used
- **plugin-sc-mc-exercise**. Plugin config now accepts an optional \`i18n\` attribute that allows to override the strings used
- **plugin-serlo-injection**. Plugin config now accepts an optional \`i18n\` attribute that allows to override the strings used
- **plugin-spoiler**. Plugin config now accepts an optional \`i18n\` attribute that allows to override the strings used
- **plugin-table**. Plugin config now accepts an optional \`i18n\` attribute that allows to override the strings used
- **plugin-text**. Plugin config now accepts an optional \`i18n\` attribute that allows to override the strings used
- **plugin-video**. Plugin config now accepts an optional \`i18n\` attribute that allows to override the strings used
`,
          `We marked some API as experimental. They can still be imported by appending \`/beta\` to the package name if you want to try them out before they are stable:
- **core**. Mark \`EditorProvider\` and \`Document\` as beta API
- **core**. Mark \`Preference\`, \`PreferenceContext\` and \`setDefaultPreference\` as beta API'
- **document-editor**. Mark as beta API'
- **default-document-editor**. Mark as beta API
- **default-plugin-toolbar**. Mark as beta API
- **plugin-toolbar**. Mark as beta API
- **store**. Mark \`getClipboard\` and \`copy\` as beta API
`,
          `We removed some exports that were only used internally or weren't supposed to be exported:
- **core**. Remove \`EditorContext\`
- **editor-ui**. Remove \`AddButton\`, \`CheckElement\`, \`CheckElementProps\`, \`InteractiveAnswer\`, \`PreviewOverlay\`, \`PreviewOverlayProps\`. We'll experiment with these components internally and might publish them in some way in the future again
- **editor-ui**. Remove \`create*Theme\`, \`OnClickOutside\`, \`Resizable\`, \`UploadProgress\`
- **renderer-ui**. Remove \`create*Theme\`, \`FetchDimensions\`'
- **renderer-ui**. Remove \`ExerciseState\`, \`Feedback\`, \`FeedbackProps\`, \`SubmitButton\`. We'll experiment with these components internally and might publish them in some way in the future again.
- **store**. Mark actions intended for internal use only as internal API
- **store**. Hide some internal types (e.g. the structure of \`HistoryState\`)
- **ui**. Remove unused \`SelectTheme\` and \`TextareaTheme\`
- **ui**. Remove the deprecated \`edtrRowsControls\` and \`edtrTextControls\`,
- **ui**. Remove \`ThemeConsumer\`. Use \`ThemeContext.Consumer\` instead.
- **ui**. Remove \`BottomToolbarTheme\`, \`ButtonTheme\`, \`CheckboxTheme\`, \`InputTheme\` types. Use \`EditorUiTheme['*']\` instead
- **ui**. Remove \`ExpandableBoxTheme\`, \`SubmitButtonTheme\` types. Use \`RendererUiTheme['*']\` instead
`,
          `We improved (in our humble opinion 😬) the names of exports in a couple of places resp. improved consistency:
- **core**. Rename \`DocumentProps\` to \`SubDocumentProps\`
- **editor-ui**. Rename \`BottomToolbar\` to \`EditorBottomToolbar\`
- **editor-ui**. Rename \`PrimarySettings\` to \`EditorInlineSettings\`
- **editor-ui**. Rename \`editorInputWidth\` to \`inputWidth\` and \`textfieldWidth\` to \`width\` in \`EditorInputProps\`
- **plugin**. Renamed \`defaultFocusRef\` to \`autofocusRef\` in \`EditorPluginProps\`
- **renderer-ui**. Move \`EditorTextarea\` into \`@edtr-io/editor-ui\`
- **store**. Rename \`instances\` to \`scopes\` in \`StoreOptions\` (and therefore in \`createStore\`, too)',
- **store**. Rename \`ActionFromActionCreator\` to \`ActionCreatorAction\`
- **store**. Rename \`ReturnTypeFromSelector\` to \`SelectorReturnType\`
- **ui**. Rename \`edtrFormel\` to \`edtrFormula\`
- **ui**. \`createEditorUiTheme\` now accepts the key of the editor UI component directly
- **ui**. \`createRendererUiTheme\` now accepts the key of the renderer UI component directly
`,
        ],
      },
      {
        tagName: 'v0.52.1',
        name: '0.52.1',
        date: '2020-02-20',
        fixed: ['Specify correct Edtr.io version in peer dependencies'],
      },
      {
        tagName: 'v0.52.2',
        name: '0.52.2',
        date: '2020-02-26',
        fixed: ['**store**. Remove `json-stringify-deterministic` dependency'],
      },
      {
        tagName: 'v1.0.0-beta.0',
        name: '1.0.0-beta.0',
        date: '2020-02-29',
        fixed: ['Correctly specify nested peer dependencies'],
        added: [
          '**plugin-text**. Add optional `plugins` to `createTextPlugin` that allows to specify the activated features. This is an interim solution until the plugin supports [Slate v0.50+](https://github.com/edtr-io/edtr-io/pull/261)',
        ],
      },
      {
        tagName: 'v1.0.0-beta.1',
        name: '1.0.0-beta.1',
        date: '2020-03-02',
        breakingChanges: [
          '**plugin**. Remove `onPaste` in favor of `onText` and `onFiles`',
        ],
        fixed: [
          '**core**. Fix some warnings introduced in React v16.13.0',
          '**plugin-rows**. Fix drag and drop of native files',
          '**plugin-video**. Fix i18n',
        ],
      },
      {
        tagName: 'v1.0.0-beta.2',
        name: '1.0.0-beta.2',
        date: '2020-03-10',
        added: ['**plugin-rows**. Only allow configured plugins to be dropped'],
      },
      {
        tagName: 'v1.0.0-beta.3',
        name: '1.0.0-beta.3',
        date: '2020-04-07',
        fixed: [
          '**default-document-editor**. Allow to configure i18n, use English strings by default.',
          '**plugin-geogebra**. Handle multiple GeoGebra applets correctly.',
        ],
      },
      {
        tagName: 'v1.0.0-beta.4',
        name: '1.0.0-beta.4',
        date: '2020-05-18',
        added: [
          '**ui**. Expose `merge` function that extends a `DeepPartial<T>` to `T` in a type-safe manner by defining fallback values.',
        ],
        fixed: [
          '**core**. Fix warning "cannot update a component while rendering a different component" in `renderIntoToolbar`.',
          '**default-document-editor**. Fix type declaration of `DefaultDocumentEditorConfig`',
          '**plugin-video**. Fix type declaration of `VideoConfig`.',
        ],
      },
      {
        tagName: 'v1.0.0',
        name: '1.0.0',
        date: '2020-09-15',
        description:
          'Bump version to v1.0.0 since the current version is already used in production by Serlo.',
        breakingChanges: [
          [
            'core, plugin-rows',
            'We now have a peer dependency on `react-dnd@^11.0.0` and `react-dnd-html5-backend@^11.0.0` (both `^10.0.0` previously)',
          ],
          [
            'editor-ui',
            '`EditorTextarea` does not accept `inputRef` anymore. Use `ref` instead.',
          ],
          [
            'plugin',
            'Remove `onPaste` in favor of `onText` and `onFiles` (v1.0.0-beta.1)',
          ],
        ],
        changed: [
          'Update dependencies.',
          'Widen version range of peer dependencies.',
          [
            'core, plugin-rows',
            'We now have a peer dependency on `react-dnd@^11.0.0` and `react-dnd-html5-backend@^11.0.0` (both `^10.0.0` previously)',
          ],
          [
            'editor-ui',
            '`EditorTextarea` does not accept `inputRef` anymore. Use `ref` instead.',
          ],
        ],
        fixed: ['Correctly declare all needed peer dependencies.'],
        internal: ['**demo**. Deploy demo with Vercel.'],
      },
      {
        tagName: 'v1.0.1',
        name: '1.0.1',
        date: '2020-09-15',
        fixed: ['Correctly specify `@edtr-io/core` peer dependency.'],
      },
      {
        tagName: 'v1.0.2',
        name: '1.0.2',
        date: '2020-09-22',
        fixed: [
          'You no longer need to polyfill `regenerator-runtime` yourself.',
        ],
      },
      {
        tagName: 'v1.0.3',
        name: '1.0.3',
        date: '2020-10-13',
        fixed: [
          [
            'plugin-input-exercise',
            'Ignore unary positive when comparing numbers and terms.',
          ],
        ],
      },
      {
        tagName: 'v1.1.0',
        name: '1.1.0',
        date: '2020-10-29',
        added: [
          [
            'editor-ui',
            'Expose `HoverOverlay` component that shows an overlay above or below the given ref. This component was part of `@edtr-io/plugin-text` before.',
          ],
          [
            'math',
            'The new package `@edtr-io/math` exposes our `MathEditor` and `MathRenderer` that were part of `@edtr-io/plugin-text` before.',
          ],
        ],
        fixed: [
          [
            'plugin-text',
            'Deleting an empty text node should no longer trigger browser hotkeys ([#304](https://github.com/edtr-io/edtr-io/issues/304)).',
          ],
        ],
      },
      {
        tagName: 'v1.2.0',
        name: '1.2.0',
        date: '2020-10-30',
        added: [
          [
            'editor-ui',
            '`EditorTextarea` now accepts optional props `onMoveOutLeft` and `onMoveOutRight` that allow to attach custom behavior when navigating with arrow keys at the end resp. beginning of the textarea.',
          ],
        ],
        changed: [
          [
            'plugin-text',
            'The text plugin utilizes the improved `MathEditor` which makes navigation with the keyboard easier when math formulas are involved.',
          ],
        ],
        fixed: [
          ['math', '`MathEditor` focuses automatically again.'],
          [
            'math',
            '`onInlineChange` is no longer a required prop for `MathEditor`.',
          ],
        ],
      },
      {
        tagName: 'v1.3.0',
        name: '1.3.0',
        date: '2020-11-02',
        added: [['plugin-text', 'Add inline code.']],
      },
      {
        tagName: 'v1.3.1',
        name: '1.3.1',
        date: '2020-11-04',
        fixed: [
          'Fix styling of overlays.',
          ['plugin-rows', 'Fix duplicate functionality.'],
        ],
      },
      {
        tagName: 'v2.0.0',
        date: '2021-04-29',
        breakingChanges: [
          'Drop Node v10 support.',
          'Drop React v16 support.',
          'We now have a peer dependency on `react-dnd@^14.0.0` and `react-dnd-html5-backend@^14.0.0` (both `^11.0.0` previously)',
        ],
        added: [['store', 'Add `hasUndoActions` and `hasRedoActions`.']],
      },
      {
        tagName: 'v2.0.1',
        date: '2021-05-13',
        fixed: ['Update dependencies.'],
      },
      {
        tagName: 'v2.0.2',
        date: '2021-08-17',
        fixed: [
          [
            'multimedia-explanation',
            'Show option to change multimedia type only if there are multiple multimedia plugins.',
          ],
        ],
      },
      {
        tagName: 'v2.1.0',
        date: '2021-08-17',
        added: [
          ['multimedia-explanation', 'Allow to disable importance feature.'],
        ],
        fixed: [
          ['multimedia-explanation', 'Do not render empty multimedia objects.'],
        ],
      },
      {
        tagName: 'v2.2.0',
        date: '2021-08-31',
        added: [
          ['multimedia-explanation', 'Add button to reset multimedia content.'],
        ],
      },
      {
        tagName: 'v2.3.0',
        date: '2021-10-11',
        added: [
          ['plugin-input-exercise', 'Add labels for answer and feedback.'],
          ['plugin-sc-mc-exercise', 'Add labels for answer and feedback.'],
        ],
        changed: [
          ['math', 'Show overlay below the text.'],
          ['plugin-input-exercise', 'Display exercise type chooser inline.'],
          ['plugin-sc-mc-exercise', 'Display exercise type chooser inline.'],
        ],
      },
      {
        tagName: 'v2.3.1',
        date: '2021-10-13',
        fixed: [
          [
            'plugin-text',
            "Don't show suggestions if there aren't any options.",
          ],
        ],
      },
      {
        tagName: 'v2.3.2',
        date: '2022-03-10',
        changed: [['math', 'Show overlay above the text.']],
      },
      {
        tagName: 'v2.4.0',
        date: '2022-03-25',
        added: [['plugin-text', 'Expose additional settings.']],
      },
      {
        tagName: 'v2.5.0',
        date: '2022-03-30',
        changed: [
          ['plugin-text', 'Suggestions are hydrated via `plugin-rows`.'],
        ],
        fixed: [
          'Official plugins no longer have a different internal config type. This should make overriding the config more intuitive.',
        ],
      },
      {
        tagName: 'v2.5.1',
        date: '2022-04-15',
        fixed: [
          ['plugin-text', '`noLineBreaks` now also disables block math.'],
        ],
      },
      {
        tagName: 'v2.5.2',
        date: '2022-05-09',
        added: [['plugin-image', 'Add caption of images.']],
      },
      {
        tagName: 'v2.6.0',
        date: '2022-05-23',
        added: [['plugin-rows', 'Add `isEmptyRows` selector.']],
      },
      {
        tagName: 'v2.7.0',
        date: '2022-06-05',
        changed: [['plugin-image', 'No longer allow colors in caption.']],
      },
      {
        tagName: 'v2.8.0',
        date: '2022-06-14',
        changed: [['plugin-image', 'Show description in settings only.']],
      },
      {
        tagName: 'v2.8.1',
        date: '2022-06-28',
        fixed: [['plugin-serlo-injection', 'No longer check origin.']],
      },
      {
        tagName: 'v2.8.2',
        date: '2022-06-29',
        fixed: [
          ['store', 'Fix child.replace.'],
          ['editor-ui', 'Make sure that the hover overlay is always visible.'],
        ],
      },
      {
        tagName: 'v2.8.3',
        date: '2022-06-29',
        changed: [['plugin-serlo-injection', 'Simplify `createURL`.']],
      },
      {
        tagName: 'v3.0.0',
        date: '2023-03-29',
        breakingChanges: [
          ['plugin-text', 'Upgrade to newest slate version'],
          'Remove package `store-devtools`',
        ],
        changed: [
          ['plugin-rows', 'Increase visibility of button to add plugins'],
          'Show document toolbar also on hover',
          'Use ESM module format in the repository',
          'Update various dependencies',
        ],
      },
      {
        tagName: 'v3.0.1',
        date: '2023-03-29',
        changed: [
          ['plugin-text', 'Export CustomElement and CustomText types'],
          'Implement defaultImport re-export workaround',
        ],
      },
      {
        tagName: 'v3.0.2',
        date: '2023-03-30',
        changed: [
          ['plugin-text', 'Move window.getSelection call inside of component'],
          ['plugin-text', 'Use list-item-child instead of list-item-text'],
        ],
      },
    ],
  })

  await writeFile(path.join(__dirname, '..', 'CHANGELOG.md'), content)
}
