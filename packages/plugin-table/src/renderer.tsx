import { StatefulPluginEditorProps } from '@edtr-io/core'
import { Icon, faTable, styled } from '@edtr-io/editor-ui'
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

const StyledIcon = styled(Icon)({ marginRight: '5px' })

export function TableRenderer(
  props: StatefulPluginEditorProps<typeof tableState> & { placeholder?: string }
) {
  const { editable, state, placeholder } = props

  return (
    <TableContainer>
      {editable && state.value.trim() === '' ? (
        <StyledIcon icon={faTable} />
      ) : null}
      <ReactMarkdown source={state.value || placeholder} />
    </TableContainer>
  )
}
