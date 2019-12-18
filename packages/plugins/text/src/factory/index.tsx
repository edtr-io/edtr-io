import { scalar, EditorPlugin } from '@edtr-io/plugin'
import { Value, ValueJSON } from 'slate'

import { emptyDocument, defaultNode } from '../model'
import { TextEditor } from './editor'
import { TextConfig, TextState } from '..'

export const textState = scalar<ValueJSON>(emptyDocument)

export const createTextPlugin = (
  config: TextConfig
): EditorPlugin<TextState, TextConfig> => {
  return {
    Component: TextEditor,
    config,
    state: textState,
    onKeyDown() {
      return false
    },
    isEmpty: state => {
      const value = Value.fromJSON(state)
      return isValueEmpty(value)
    }
  }
}

export function isValueEmpty(value: Value) {
  // check if there is no content and only one node
  if (
    value.document.text !== '' ||
    value.document.nodes.size !== 1 ||
    value.document.getTexts().size !== 1
  ) {
    return false
  }

  // check if the node is the default node
  const block = value.document.nodes.get(0)
  return block.object !== 'text' && block.type === defaultNode
}
