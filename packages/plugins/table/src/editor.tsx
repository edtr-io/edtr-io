import { EditorTextarea } from '@edtr-io/editor-ui'
import { styled } from '@edtr-io/ui'
import * as React from 'react'

import { TableProps } from '.'
import { useTableConfig } from './config'
import { TableRenderer } from './renderer'

const Form = styled.form({
  marginTop: '10px',
})

export function TableEditor(props: TableProps) {
  const { focused, state } = props
  const config = useTableConfig(props.config)

  return (
    <div>
      {focused ? (
        <Form>
          <div>
            <EditorTextarea
              value={state.value}
              placeholder={config.i18n.placeholder}
              name="markdown"
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                state.set(e.target.value)
              }}
              ref={props.autofocusRef}
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
