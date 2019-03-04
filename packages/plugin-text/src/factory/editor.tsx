import * as React from 'react'
import { Editor, findNode } from 'slate-react'
import { Editor as CoreEditor } from 'slate'
import { TextPluginOptions } from './types'
import { StatefulPluginEditorProps } from '@edtr-io/core'

import { textState } from '.'

export type SlateEditorProps = StatefulPluginEditorProps<typeof textState>

export const createTextEditor = (
  options: TextPluginOptions
): React.ComponentType<SlateEditorProps> => {
  return function SlateEditor(props: SlateEditorProps) {
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
          props.state.set(() => editor.value)
        }}
        placeholder={options.placeholder}
        plugins={options.plugins}
        readOnly={!props.focused}
        value={props.state.value}
        onBlur={(_e, editor) => editor}
      />
    )
  }
}
