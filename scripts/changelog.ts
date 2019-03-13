import { generateChangelog } from '@splish-me/changelog'
import * as fs from 'fs'
import * as path from 'path'
import * as util from 'util'

const writeFile = util.promisify(fs.writeFile)

exec().then(() => {})

async function exec(): Promise<void> {
  const content = await generateChangelog([
    {
      tagName: '0.1.0',
      date: '2019-02-08',
      description: 'Initial release'
    },
    {
      tagName: '0.2.0',
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
      tagName: '0.2.1',
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
      tagName: '0.3.0',
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
      tagName: '0.3.1',
      date: '2019-03-13',
      added: ['GeoGebra plugin'],
      changed: ['**plugin-spoiler**. Remove input element in render mode'],
      fixed: ["**plugin-text**. Don't dispatch selection changes anymore"]
    }
  ])

  await writeFile(path.join(__dirname, '..', 'CHANGELOG.md'), content)
}
