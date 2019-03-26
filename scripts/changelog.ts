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
        '**ui**. Add `ContainerWithConfigButton` component for opening the Settings Overlay.',
        '**plugin-image**. Added `onPaste` handler accepting jpg, png, bmp, gif, svg',
        '**plugin-image**. Use ContainerWithConfigButton',
        '**plugin-video**. Added video plugin',
        '**plugin-video**. Use ContainerWithConfigButton',
        '**plugin-geogebra**. Use ContainerWithConfigButton'
      ],
      fixed: [
        '**core**. Handle focus in nested documents correctly',
        '**plugin-rows**. Align top and bottom add butons correctly in custom integrations',
        '**plugin-text**. Disable slate undo/redo',
        '**plugin-text**. Refocus after undo/redo',
        '**plugin-text**. Display Link-Overlay only when plugin is focused'
      ],
      internal: [
        '**demo**. Plugins available to the demo storybook are now defined in `demo/src/plugins.tsx`',
        '**demo**. Added `build-demo` task that builds the demo storybook (and deploys it automatically to Netlify). The demo of the master branch is available on https://demo.edtr.io',
        '**demo**. Brand the demo storybook'
      ]
    }
  ])

  await writeFile(path.join(__dirname, '..', 'CHANGELOG.md'), content)
}
