import { PluginEditorProps } from '@edtr-io/plugin'
import { styled } from '@edtr-io/ui'
import * as React from 'react'

import { rowsState } from '.'

const Row = styled.div({
  marginBottom: '25px'
})

export function RowsRenderer(props: PluginEditorProps<typeof rowsState>) {
  return (
    <React.Fragment>
      {props.state.map(row => {
        return <Row key={row.id}>{row.render()}</Row>
      })}
    </React.Fragment>
  )
}
