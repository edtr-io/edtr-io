import { Hint } from '@edtr-io/ui'
import { Document, StatefulPluginEditorProps } from '@edtr-io/core'
import { hintState } from '.'
import * as React from 'react'

export const HintRenderer = (
  props: StatefulPluginEditorProps<typeof hintState>
) => {
  const { state } = props
  return (
    <Hint kind="Tipp" title={state.value.title.value}>
      <Document state={state.value.content.$$value} />
    </Hint>
  )
}
