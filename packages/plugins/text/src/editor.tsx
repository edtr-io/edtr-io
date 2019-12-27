import * as React from 'react'
import { createEditor, Transforms } from 'slate'
import { Slate, Editable, withReact } from 'slate-react'

import { TextProps } from '.'

export function TextEditor({ editable, state }: TextProps) {
  const { value, selection } = state.get()
  const persistedValue = React.useRef(value)

  const editor = React.useMemo(() => {
    const editor = withReact(createEditor())

    // Disable Slate's undo/redo
    editor.undo = () => {}
    editor.redo = () => {}
    return editor
  }, [])

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
      <Editable readOnly={!editable} />
    </Slate>
  )
}
