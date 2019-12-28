import isHotKey from 'is-hotkey'
import * as R from 'ramda'
import * as React from 'react'
import { createEditor as createSlateEditor, Editor, Transforms } from 'slate'
import { Slate, Editable, withReact, ReactEditor } from 'slate-react'

import { TextConfig, TextProps } from '.'
import { toggleMark } from './helpers'

export function TextEditor({ config, editable, state }: TextProps) {
  const { value, selection } = state.get()
  const { marks } = config
  const persistedValue = React.useRef(value)

  const editor = React.useMemo(createEditor, [])
  const renderLeaf = React.useMemo(() => {
    return createRenderLeaf(marks)
  }, [marks])
  const onKeyDown = React.useMemo(() => {
    return createOnKeyDown(editor, marks)
  }, [editor, marks])

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
      <Editable
        readOnly={!editable}
        renderElement={props => {
          switch (props.element.type) {
            // case 'strong':
            //   return <StrongElement {...props} />
            default:
              return <p {...props.attributes}>{props.children}</p>
          }
        }}
        renderLeaf={renderLeaf}
        onKeyDown={onKeyDown}
      />
    </Slate>
  )
}

function createEditor(): ReactEditor {
  const editor = withReact(createSlateEditor())

  // Disable Slate's undo/redo
  editor.undo = () => {}
  editor.redo = () => {}
  return editor
}

function createRenderLeaf(
  marks: TextConfig['marks']
): React.ComponentProps<typeof Editable>['renderLeaf'] {
  return function renderLeaf(props) {
    let children = props.children
    R.forEachObjIndexed(({ Component }, mark) => {
      if (props.leaf[mark as string]) {
        children = <Component>{children}</Component>
      }
    }, marks)

    return <span {...props.attributes}>{children}</span>
  }
}

function createOnKeyDown(
  editor: Editor,
  marks: TextConfig['marks']
): React.ComponentProps<typeof Editable>['onKeyDown'] {
  return function onKeyDown(event) {
    const e = (event as unknown) as KeyboardEvent
    R.forEachObjIndexed(({ hotkey }, mark) => {
      if (hotkey && isHotKey(hotkey, e)) {
        e.preventDefault()
        toggleMark(editor, mark as string)
      }
    }, marks)
  }
}
