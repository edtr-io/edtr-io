import { StatefulPluginEditorProps } from '@edtr-io/core'
import { styled } from '@edtr-io/editor-ui'
import * as React from 'react'
import Textarea from 'react-textarea-autosize'

import { TableRenderer } from './renderer'
import { tableState } from '.'

const Form = styled.form({
  marginTop: '10px'
})

const MarkdownTextarea = styled(Textarea)({
  minHeight: '100px',
  width: '100%',
  margin: 'auto',
  padding: '10px',
  resize: 'none',
  fontFamily: 'Menlo, Monaco, "Courier New", monospace',
  border: 'none',
  outline: 'none',
  boxShadow: '0 1px 1px 0 rgba(0,0,0,0.50)',
  '&::-webkit-input-placeholder': {
    color: 'rgba(0,0,0,0.5)'
  }
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
            <MarkdownTextarea
              value={state.value}
              placeholder="Schreibe deine Tabelle in Markdown. Eine Vorschau siehst du, wenn du das Plugin verlässt."
              name="markdown"
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                state.set(e.target.value)
              }}
            >
              {state.value}
            </MarkdownTextarea>
          </div>
        </Form>
      ) : (
        <TableRenderer {...props} />
      )}
    </div>
  )
}
