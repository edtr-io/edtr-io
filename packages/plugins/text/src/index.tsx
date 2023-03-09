import { EditorPlugin, serializedScalar } from '@edtr-io/plugin'

import { TextEditor } from './components/text-editor'
import type { TextEditorProps } from './components/text-editor'
import type {
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
  /* TODO
  isEmpty: (state) => {
    return isValueEmpty(Value.fromJSON(state.value))
  },
    */
})

export { createTextPlugin }

export type {
  TextEditorConfig,
  TextEditorControl,
  TextEditorPluginConfig,
  TextEditorState,
  TextEditorProps,
}
