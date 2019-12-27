import {
  EditorPlugin,
  EditorPluginProps,
  serializedScalar
} from '@edtr-io/plugin'
import { Node, Range } from 'slate'

import { TextEditor } from './editor'

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
export type TextProps = EditorPluginProps<TextState>

// TODO:
export function createTextPlugin(_config: any): EditorPlugin<TextState> {
  return {
    Component: TextEditor,
    config: {},
    state: textState
  }
}
