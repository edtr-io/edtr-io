import * as React from 'react'
import { Editor, findNode } from 'slate-react'
import { Editor as CoreEditor, Value } from 'slate'
import { TextPluginOptions } from './types'
import { StatefulPluginEditorProps } from '@edtr-io/core'

import { textState } from '.'

export type SlateEditorProps = StatefulPluginEditorProps<typeof textState>

export const createTextEditor = (
  options: TextPluginOptions
): React.ComponentType<SlateEditorProps> => {
  return function SlateEditor(props: SlateEditorProps) {
    const [rawState, setRawState] = React.useState(
      Value.fromJSON(props.state.value)
    )
    const lastValue = React.useRef(props.state.value)
    React.useEffect(() => {
      if (lastValue.current !== props.state.value) {
        setRawState(Value.fromJSON(props.state.value))
        lastValue.current = props.state.value
      }
    }, [lastValue, props.state.value])
    return (
      <Editor
        onClick={(e, editor, next): CoreEditor | void => {
          // console.log('onClick', e)
          if (e.target) {
            // @ts-ignore
            const node = findNode(e.target as Element, editor)
            if (!node) {
              return editor
            }
          }
          next()
        }}
        onChange={change => {
          const nextValue = change.value.toJSON()
          setRawState(change.value)
          const withoutSelections = change.operations.filter(
            operation =>
              typeof operation !== 'undefined' &&
              operation.type !== 'set_selection'
          )
          if (!withoutSelections.isEmpty()) {
            lastValue.current = nextValue
            props.state.set(nextValue)
          }
        }}
        placeholder={options.placeholder}
        plugins={options.plugins}
        readOnly={!props.focused}
        value={rawState}
      />
    )
  }
}
