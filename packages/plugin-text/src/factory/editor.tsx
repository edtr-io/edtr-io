import * as React from 'react'
import { Editor, findNode } from 'slate-react'
import { Editor as CoreEditor, Value, ValueJSON } from 'slate'
import { TextPluginState, TextPluginOptions } from './types'
import { StatefulPluginEditorProps } from '@edtr-io/core'

import { textState } from '.'

export type SlateEditorProps = StatefulPluginEditorProps<typeof textState>

export const createTextEditor = (
  options: TextPluginOptions
): React.ComponentType<SlateEditorProps> => {
  return function SlateEditor(props: SlateEditorProps) {
    const [value, setValue] = React.useState(Value.fromJSON(props.state.value))
    const lastValue = React.useRef<ValueJSON>(props.state.value)
    // const { state, editable, focused } = this.props
    // console.log(state)
    React.useEffect(() => {
      if (lastValue.current !== props.state.value) {
        setValue(Value.fromJSON(props.state.value))
      }
    }, [])

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
        onChange={editor => {
          lastValue.current = editor.value.toJSON()
          props.state.set(lastValue.current)
          setValue(editor.value)
        }}
        // TODO: we might need custom `onKeyDown`
        placeholder={options.placeholder}
        plugins={options.plugins}
        readOnly={!props.focused}
        value={value}
        onBlur={(_e, editor) => editor}
      />
    )
  }
}
