import { DeprecatedPluginEditorProps } from '@edtr-io/plugin'
import { Icon, faTable, styled } from '@edtr-io/ui'
import * as React from 'react'

import { TablePluginConfig, tableState } from '.'

const TableContainer = styled.div({
  overflowX: 'auto',
  '& tr': {
    borderTop: '1px solid #c6cbd1'
  },
  '& th, & td': {
    padding: '6px 13px',
    border: '1px 1px solid #dfe2e5'
  },
  '& table tr:nth-child(2n)': {
    background: '#f6f8fa'
  },
  '& table': {
    width: '100%',
    maxWidth: '100%'
  }
})

const StyledIcon = styled(Icon)({ marginRight: '5px' })

export function createTableRenderer(config: TablePluginConfig) {
  return function TableRenderer(
    props: DeprecatedPluginEditorProps<typeof tableState>
  ) {
    const { editable, state } = props

    const renderedMarkdown = config.renderMarkdown(state.value)

    return (
      <TableContainer>
        {editable && state.value.trim() === '' ? (
          <StyledIcon icon={faTable} />
        ) : null}
        {typeof renderedMarkdown === 'string' ? (
          <div
            dangerouslySetInnerHTML={{
              __html: renderedMarkdown
            }}
          />
        ) : (
          renderedMarkdown
        )}
      </TableContainer>
    )
  }
}
