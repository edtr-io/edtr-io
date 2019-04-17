import { StatefulPluginEditorProps } from '@edtr-io/core'
import { styled } from '@edtr-io/ui'
import * as React from 'react'

import { rowsState } from '.'
import { Row } from './row'

const RowsContainer = styled.div({ position: 'relative' })

export const RowsEditor = (
  props: StatefulPluginEditorProps<typeof rowsState>
) => {
  const rows = props.state
  return (
    <RowsContainer>
      {rows.items.map((row, index) => {
        return (
          <div key={row.id} style={{ position: 'relative' }}>
            <Row {...props} index={index} />
          </div>
        )
      })}
    </RowsContainer>
  )
}
