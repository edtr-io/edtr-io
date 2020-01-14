import { useScopedStore } from '@edtr-io/core'
import * as React from 'react'
import { createEditor as createSlateEditor, Transforms } from 'slate'
import { Slate, Editable, withReact, ReactEditor } from 'slate-react'

import { TextConfig, TextProps } from '.'
import { ConfigContext } from './helpers'
import { Editor } from './types'

export function TextEditor({ config, editable, focused, state }: TextProps) {
  const store = useScopedStore()
  const { value } = state.get()
  const { defaultNode, placeholder, plugins } = config
  const persistedValue = React.useRef(value)

  const editor = React.useMemo(() => {
    return createEditor({ defaultNode, plugins, store })
  }, [defaultNode, plugins, store])
  const previousSelection = React.useRef(editor.selection)

  // Set selection from state if there was an undo/redo
  if (persistedValue.current !== value) {
    const selection = state.get().selection
    if (selection) {
      Transforms.select(editor, selection)
    }
  }

  // Workaround for https://github.com/ianstormtaylor/slate/issues/3321
  const staleReadOnlyKey = focused ? '1' : '0'

  return (
    <ConfigContext.Provider value={config}>
      <Slate
        key={staleReadOnlyKey}
        editor={editor}
        value={value}
        onChange={newValue => {
          // Don't persist if there was no actual change
          if (newValue !== value) {
            persistedValue.current = newValue
            state.set(
              {
                value: newValue,
                selection: editor.selection
              },
              ({ value }) => {
                return {
                  value,
                  // When undoing this change, we want to jump back to the selection we had right before the change
                  // Therefore, we always keep track of the previous selection and override the default reverse behavior
                  selection: previousSelection.current
                }
              }
            )
          }

          previousSelection.current = editor.selection
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
    </ConfigContext.Provider>
  )
}

function createEditor({
  defaultNode,
  plugins,
  store
}: {
  defaultNode: TextConfig['defaultNode']
  plugins: TextConfig['plugins']
  store: ReturnType<typeof useScopedStore>
}): Editor {
  let editor = withEdtr(withReact(createSlateEditor()))
  plugins.forEach(withPlugin => {
    editor = withPlugin(editor, store)
  })
  editor.defaultNode = defaultNode
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
