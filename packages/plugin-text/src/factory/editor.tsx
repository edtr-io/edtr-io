import * as React from 'react'
import { Editor, findNode } from 'slate-react'

import { TextPluginState, TextPluginOptions } from './types'
export interface SlateEditorProps {
  onChange: (state: Partial<TextPluginState>) => void
  state: TextPluginState
}

export const createTextEditor = (
  options: TextPluginOptions
): React.ComponentType<SlateEditorProps> => {
  return class SlateEditor extends React.Component<SlateEditorProps> {
    public render() {
      const { onChange, state } = this.props

      return (
        <Editor
          // onClick={(e, editor): Editor | void => {
          //   const node = findNode(e.target, editor.value)
          //
          //   // If we can't find the node (e.g. because we clicked in the sidebar), ignore core plugins to avoid throwing erros
          //   if (!node) {
          //     e.preventDefault()
          //     return editor
          //   }
          // }}
          onChange={editor => {
            onChange({ editorState: editor.value })
          }}
          // TODO: we might need custom `onKeyDown`
          placeholder={options.placeholder}
          plugins={options.plugins}
          readOnly={false} //TODO: add readOnly to props
          value={state.editorState}
          onBlur={(_e, editor) => editor}
          // @ts-ignore Additional props for ui plugin
          // focused={true} //TODO: add focused to props
        />
      )
    }
  }
}
