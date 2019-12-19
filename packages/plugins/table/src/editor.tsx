import { PluginEditorProps } from '@edtr-io/plugin'
import { EditorTextarea } from '@edtr-io/renderer-ui'
import { styled } from '@edtr-io/ui'
import * as React from 'react'

import { TablePluginConfig, tableState } from '.'
import { createTableRenderer } from './renderer'

const Form = styled.form({
  marginTop: '10px'
})

export const createTableEditor = (config: TablePluginConfig) => {
  const TableRenderer = createTableRenderer(config)
  return function TableEditor(props: PluginEditorProps<typeof tableState>) {
    const { focused, state } = props
    return (
      <div>
        {focused ? (
          <Form>
            <div>
              <EditorTextarea
                value={state.value}
                placeholder="Schreibe deine Tabelle in Markdown. Eine Vorschau siehst du unten."
                name="markdown"
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                  state.set(e.target.value)
                }}
                ref={props.defaultFocusRef}
              >
                {state.value}
              </EditorTextarea>
              <TableRenderer {...props} />
            </div>
          </Form>
        ) : (
          <TableRenderer {...props} />
        )}
      </div>
    )
  }
}
