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
      // @ts-ignore Additional props for ui plugin
      <Editor
        onClick={(e, editor, next): CoreEditor | void => {
          // console.log('onClick', e)
          if (e.target) {
            // @ts-ignore
            const node = findNode(e.target as Element, editor)
            // If we can't find the node (e.g. because we clicked in the sidebar), ignore core plugins to avoid throwing erros
            if (!node) {
              e.preventDefault()
              return editor
            }
          }
          next()
        }}
        onChange={editor => {
          lastValue.current = editor.value.toJSON()
          props.state.set(lastValue.current)
          setValue(editor.value)
          // state.set(editor.value)
          // onChange({ editorState: editor.value })
        }}
        // TODO: we might need custom `onKeyDown`
        placeholder={options.placeholder}
        plugins={options.plugins}
        readOnly={!props.editable}
        value={value}
        onBlur={(_e, editor) => editor}
        // @ts-ignore Additional props for ui plugin
        focused={props.focused}
      />
    )
  }
}
