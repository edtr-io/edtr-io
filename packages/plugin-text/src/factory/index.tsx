import { Value } from 'slate'

import { createTextEditor } from './editor'
import { TextPluginOptions } from './types'
import { StateType } from '@edtr-io/core'

export const defaultNode = 'paragraph'

const serializer = {
  deserialize: Value.fromJSON,
  serialize: (val: Value) => val.toJSON()
}

export const textState = StateType.serializedScalar(
  serializer.deserialize({
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
  }),
  serializer
)

export const createTextPlugin = (options: TextPluginOptions) => {
  return {
    Component: createTextEditor(options),
    state: textState
  }
}
