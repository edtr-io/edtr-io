import { createIcon, faParagraph } from '@edtr-io/editor-ui'
import { scalar, StatefulPlugin } from '@edtr-io/plugin'
import { Value, ValueJSON } from 'slate'

import { createTextEditor, SlateEditorAdditionalProps } from './editor'
import { TextPluginOptions } from './types'

export const defaultNode = 'paragraph'

const emptyDocument: ValueJSON = {
  document: {
    nodes: [
      {
        object: 'block',
        type: defaultNode,
        nodes: [
          {
            object: 'text',
            leaves: []
          }
        ]
      }
    ]
  }
}

export const textState = scalar<ValueJSON>(emptyDocument)

export const createTextPlugin = (
  options: TextPluginOptions
): StatefulPlugin<typeof textState, SlateEditorAdditionalProps> => {
  return {
    Component: createTextEditor(options),
    state: textState,
    icon: createIcon(faParagraph),
    title: 'Text',
    description: 'Schreibe Text und Matheformeln und formatiere sie.',
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
  return (
    value.document.text === '' &&
    value.document.nodes.size === 1 &&
    value.document.nodes.get(0).type === defaultNode &&
    value.document.getTexts().size === 1
  )
}
