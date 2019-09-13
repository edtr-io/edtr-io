import { createIcon, faParagraph } from '@edtr-io/editor-ui'
import {
  legacyScalar,
  StateDescriptorValueType,
  StatefulPlugin
} from '@edtr-io/plugin'
import { Value, ValueJSON } from 'slate'

import { createTextEditor, SlateEditorAdditionalProps } from './editor'
import { TextPluginOptions } from './types'

export const defaultNode = 'paragraph'

const emptyDocument = {
  document: {
    nodes: [
      {
        object: 'block',
        type: defaultNode,
        nodes: [
          {
            object: 'text'
          }
        ]
      }
    ]
  }
}

export const textState = legacyScalar<ValueJSON>(
  // @ts-ignore: slightly mismatching types FIXME
  Value.fromJSON(emptyDocument).toJSON()
)

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
    isEmpty: (state: StateDescriptorValueType<typeof textState>) => {
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
