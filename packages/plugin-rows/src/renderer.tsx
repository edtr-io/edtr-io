import { StatefulPluginEditorProps } from '@edtr-io/core'
import { rowsState } from '@edtr-io/plugin-rows'
import * as React from 'react'
import { Row } from './row'

export const RowsRenderer = (
  props: StatefulPluginEditorProps<typeof rowsState>
) => {
  return (
    <React.Fragment>
      {props.state().map((row, index) => {
        return <Row state={props.state} index={index} key={row.id} />
      })}
    </React.Fragment>
  )
}
