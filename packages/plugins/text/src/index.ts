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
  placeholder: string
  plugins: TextEditorPlugin[]
}
export type TextProps = EditorPluginProps<TextState, TextConfig>

export function createTextPlugin({
  placeholder = 'Schreibe etwas oder füge mit \u2295 Elemente hinzu.',
  plugins = defaultPlugins
}: {
  placeholder?: TextConfig['placeholder']
  plugins?: TextConfig['plugins']
}): EditorPlugin<TextState, TextConfig> {
  return {
    Component: TextEditor,
    config: {
      placeholder,
      plugins
    },
    state: textState
  }
}
