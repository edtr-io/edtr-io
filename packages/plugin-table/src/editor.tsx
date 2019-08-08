import { StatefulPluginEditorProps } from '@edtr-io/core'
import { styled } from '@edtr-io/editor-ui'
import { EditorTextarea } from '@edtr-io/renderer-ui'
import * as React from 'react'

import { TableRenderer } from './renderer'
import { tableState } from '.'

const Form = styled.form({
  marginTop: '10px'
})

export const TableEditor = (
  props: StatefulPluginEditorProps<typeof tableState>
) => {
  const { focused, state } = props
  return (
    <div>
      {focused ? (
        <Form>
          <div>
            <EditorTextarea
              value={state.value}
              placeholder="Schreibe deine Tabelle in Markdown. Eine Vorschau siehst du, wenn du das Plugin verlässt."
              name="markdown"
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                state.set(e.target.value)
              }}
            >
              {state.value}
            </EditorTextarea>
          </div>
        </Form>
      ) : (
        <TableRenderer {...props} />
      )}
    </div>
  )
}
