import { EditorPlugin, serializedScalar } from '@edtr-io/plugin'

import { TextEditor } from './components/text-editor'
import type { TextProps } from './components/text-editor'
import type {
  TextConfig,
  TextConfigPlugins,
  TextPluginConfig,
  TextPluginState,
} from './types'
import { emptyDocumentFactory } from './utils/document'

/**
 * @param config - {@link TextConfig | Plugin configuration}
 * @returns The text plugin
 * @public
 */
const createTextPlugin = (
  config: TextConfig
): EditorPlugin<TextPluginState, TextConfig> => ({
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
  TextConfig,
  TextConfigPlugins,
  TextPluginConfig,
  TextPluginState,
  TextProps,
}
