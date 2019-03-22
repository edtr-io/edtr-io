import { StatefulPluginEditorProps } from '@edtr-io/core'
import { rowsState } from '@edtr-io/plugin-rows'
import * as React from 'react'
import { styled } from '@edtr-io/ui'

export const Row = styled.div({
  margin: '5px 0'
})

export const RowsRenderer = (
  props: StatefulPluginEditorProps<typeof rowsState>
) => {
  return (
    <React.Fragment>
      {props.state().map(row => {
        return <Row key={row.id}>{row.render()}</Row>
      })}
    </React.Fragment>
  )
}
