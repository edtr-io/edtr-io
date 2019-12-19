import { StateTypeSerializedType } from '@edtr-io/internal__plugin-state'
import { TextState } from '@edtr-io/plugin-text'
import { Text } from 'slate'

export function createTextState(
  texts: Text[]
): StateTypeSerializedType<TextState> {
  return {
    object: 'value',
    document: {
      object: 'document',
      data: {},
      nodes: [
        {
          object: 'block',
          type: 'paragraph',
          data: {},
          nodes: texts.map(text => text.toJSON())
        }
      ]
    }
  }
}
