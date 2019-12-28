import {
  EditorPlugin,
  EditorPluginProps,
  serializedScalar
} from '@edtr-io/plugin'
import { Node, Range } from 'slate'

import { TextEditor } from './editor'
import { defaultPlugins } from './plugins'
import { TextEditorPlugin } from './types'

const textState = serializedScalar<
  Node[],
  { value: Node[]; selection: Range | null }
>(
  {
    value: [
      {
        type: 'paragraph',
        children: [{ text: '' }]
      }
    ],
    selection: null
  },
  {
    deserialize(value) {
      return {
        value,
        selection: null
      }
    },
    serialize({ value }) {
      return value
    }
  }
)
export type TextState = typeof textState
export interface TextConfig {
  plugins: TextEditorPlugin[]
}
export type TextProps = EditorPluginProps<TextState, TextConfig>

export function createTextPlugin({
  plugins = defaultPlugins
}: {
  plugins?: TextConfig['plugins']
}): EditorPlugin<TextState, TextConfig> {
  return {
    Component: TextEditor,
    config: {
      plugins
    },
    state: textState
  }
}
