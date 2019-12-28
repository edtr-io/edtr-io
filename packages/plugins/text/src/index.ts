import {
  EditorPlugin,
  EditorPluginProps,
  serializedScalar
} from '@edtr-io/plugin'
import { Node, Range } from 'slate'

import { TextEditor } from './editor'
import { defaultMarks, Mark } from './marks'

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
  marks: { [key: string]: Mark }
}
export type TextProps = EditorPluginProps<TextState, TextConfig>

// TODO:
export function createTextPlugin({
  marks = defaultMarks
}: {
  marks?: TextConfig['marks']
}): EditorPlugin<TextState, TextConfig> {
  return {
    Component: TextEditor,
    config: {
      marks
    },
    state: textState
  }
}
