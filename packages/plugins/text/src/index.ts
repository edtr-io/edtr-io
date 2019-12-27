import { EditorPlugin, EditorPluginProps, scalar } from '@edtr-io/plugin'
import { Node } from 'slate'

import { TextEditor } from './editor'

const textState = scalar<Node[]>([
  {
    type: 'paragraph',
    children: [{ text: '' }]
  }
])
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
