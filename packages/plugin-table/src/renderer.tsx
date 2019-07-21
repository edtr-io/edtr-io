import { StatefulPluginEditorProps } from '@edtr-io/core'
import { styled } from '@edtr-io/ui'
import * as React from 'react'
import ReactMarkdown from 'react-markdown'

import { tableState } from '.'

const TableContainer = styled.div({
  '& tr': {
    borderTop: '1px solid #c6cbd1'
  },
  '& th, & td': {
    padding: '6px 13px',
    border: '1px 1px solid #dfe2e5'
  },
  '& table tr:nth-child(2n)': {
    background: '#f6f8fa'
  }
})

export function TableRenderer(
  props: StatefulPluginEditorProps<typeof tableState> & { placeholder?: string }
) {
  const { state, placeholder } = props

  return (
    <TableContainer>
      <ReactMarkdown source={state.value || placeholder} />
    </TableContainer>
  )
}
