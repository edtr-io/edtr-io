import { createTextEditor, SlateEditorAdditionalProps } from './editor'
import { TextPluginOptions } from './types'
import { StateType, StatefulPlugin } from '@edtr-io/core'
import { ValueJSON } from 'slate'

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
    }
  }
}
