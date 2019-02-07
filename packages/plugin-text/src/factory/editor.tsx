import * as React from 'react'
import { Editor, findNode } from 'slate-react'
import { Editor as CoreEditor } from 'slate'
import { TextPluginState, TextPluginOptions } from './types'
export interface SlateEditorProps {
  onChange: (state: Partial<TextPluginState>) => void
  state: TextPluginState
  focused: boolean
  editable?: boolean
}

export const createTextEditor = (
  options: TextPluginOptions
): React.ComponentType<SlateEditorProps> => {
  return class SlateEditor extends React.Component<SlateEditorProps> {
    public render() {
      const { onChange, state, editable, focused } = this.props

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
            onChange({ editorState: editor.value })
          }}
          // TODO: we might need custom `onKeyDown`
          placeholder={options.placeholder}
          plugins={options.plugins}
          readOnly={!editable}
          value={state.editorState}
          onBlur={(_e, editor) => editor}
          // @ts-ignore Additional props for ui plugin
          focused={focused}
        />
      )
    }
  }
}
