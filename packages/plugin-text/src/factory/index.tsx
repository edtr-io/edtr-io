import { createTextEditor, SlateEditorAdditionalProps } from './editor'
import { TextPluginOptions } from './types'
import { StateType, StatefulPlugin } from '@edtr-io/core'
import { Value, ValueJSON } from 'slate'
import {
  StateDescriptorReturnType,
  StateDescriptorValueType
} from '@edtr-io/core/src/plugin-state'

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
    onKeyDown() {
      return false
    },
    isEmpty: (state: StateDescriptorValueType<typeof textState>) => {
      const value = Value.fromJSON(state)
      return value.document.text === ''
    }
  }
}
