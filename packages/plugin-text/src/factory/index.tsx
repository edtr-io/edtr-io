import { ValueJSON } from 'slate'

import { createTextEditor } from './editor'
import { TextPluginOptions } from './types'
import { StateType } from '@edtr-io/core'

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

export const createTextPlugin = (options: TextPluginOptions) => {
  return {
    Component: createTextEditor(options),
    state: textState
  }
}
