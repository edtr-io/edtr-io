import * as React from 'react'
import { createEditor as createSlateEditor, Transforms } from 'slate'
import { Slate, Editable, withReact, ReactEditor } from 'slate-react'

import { TextConfig, TextProps } from '.'
import { Editor } from './types'

export function TextEditor({ config, editable, focused, state }: TextProps) {
  const { value, selection } = state.get()
  const { placeholder, plugins } = config
  const persistedValue = React.useRef(value)

  const editor = React.useMemo(() => {
    return createEditor(plugins)
  }, [plugins])

  // Set selection from state if there was an undo/redo
  if (persistedValue.current !== value && selection) {
    Transforms.select(editor, selection)
  }

  return (
    <Slate
      editor={editor}
      value={value}
      onChange={newValue => {
        // Don't persist if there was no actual change
        if (newValue === value) return
        persistedValue.current = newValue
        state.set({
          value: newValue,
          selection: editor.selection
        })
      }}
    >
      {editor.renderEditable({
        children: (
          <Editable
            placeholder={editable ? placeholder : undefined}
            readOnly={!focused}
            renderElement={editor.renderElement}
            renderLeaf={editor.renderLeaf}
            onKeyDown={event => {
              editor.onKeyDown((event as unknown) as KeyboardEvent)
            }}
          />
        ),
        editable
      })}
    </Slate>
  )
}

function createEditor(plugins: TextConfig['plugins']): Editor {
  let editor = withEdtr(withReact(createSlateEditor()))
  plugins.forEach(withPlugin => {
    editor = withPlugin(editor)
  })
  return editor

  function withEdtr<T extends ReactEditor>(editor: T): T & Editor {
    const e = editor as T & Editor
    e.controls = []
    e.onKeyDown = () => {}
    e.renderEditable = ({ children }) => {
      return children
    }
    // eslint-disable-next-line react/display-name
    e.renderElement = ({ attributes, children }) => {
      return <div {...attributes}>{children}</div>
    }
    // eslint-disable-next-line react/display-name
    e.renderLeaf = ({ attributes, children }) => {
      return <span {...attributes}>{children}</span>
    }
    return e
  }
}
