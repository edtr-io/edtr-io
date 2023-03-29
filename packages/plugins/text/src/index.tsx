import { EditorPlugin, serializedScalar } from '@edtr-io/plugin'
import { Node } from 'slate'

import { TextEditor } from './components/text-editor'
import type { TextEditorProps } from './components/text-editor'
import type {
  CustomElement,
  CustomText,
  Paragraph,
  OrderedList,
  UnorderedList,
  ListItem,
  ListItemText,
  Heading,
  Link,
  MathElement,
  TextEditorConfig,
  TextEditorControl,
  TextEditorPluginConfig,
  TextEditorState,
} from './types'
import { emptyDocumentFactory } from './utils/document'

/**
 * @param config - {@link TextEditorConfig | Plugin configuration}
 * @returns The text plugin
 * @public
 */
const createTextPlugin = (
  config: TextEditorConfig
): EditorPlugin<TextEditorState, TextEditorConfig> => ({
  Component: TextEditor,
  config,
  state: serializedScalar(emptyDocumentFactory(), {
    serialize({ value }) {
      return value
    },
    deserialize(value) {
      return { value, selection: null }
    },
  }),
  onKeyDown() {
    return false
  },
  isEmpty: (state) => {
    return state.value.value.map(Node.string).join('') === ''
  },
})

export { createTextPlugin }

export type {
  CustomElement,
  Paragraph,
  OrderedList,
  UnorderedList,
  ListItem,
  ListItemText,
  Heading,
  Link,
  MathElement,
  CustomText,
  TextEditorConfig,
  TextEditorControl,
  TextEditorPluginConfig,
  TextEditorState,
  TextEditorProps,
}
