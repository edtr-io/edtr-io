import { createTextEditor, SlateEditorAdditionalProps } from './editor'
import { TextPluginOptions } from './types'
import { StateType, StatefulPlugin } from '@edtr-io/core'
import { Value, ValueJSON } from 'slate'
import { StateDescriptorValueType } from '@edtr-io/core/src/plugin-state'
import { createIcon, faParagraph } from '@edtr-io/editor-ui'

export const defaultNode = 'paragraph'

export const textState = StateType.scalar<ValueJSON>({
  document: {
    nodes: [
      {
        object: 'block',
        type: defaultNode,
        nodes: [
          {
            object: 'text',
            leaves: [
              {
                object: 'leaf',
                text: ''
              }
            ]
          }
        ]
      }
    ]
  }
})

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
    isEmpty: (state: StateDescriptorValueType<typeof textState>) =>
      isValueEmpty(Value.fromJSON(state))
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
