import { HintRenderer } from './renderer'
import { Hint } from '@edtr-io/ui'
import { Document, StatefulPluginEditorProps } from '@edtr-io/core'
import * as React from 'react'
import { hintState } from '.'

export const HintEditor = (
  props: StatefulPluginEditorProps<typeof hintState>
) => {
  const { state, editable } = props

  if (!editable) {
    return <HintRenderer state={state} />
  }

  return (
    <Hint
      kind="Tipp"
      shown
      title={
        <input
          onChange={e => {
            state.value.title.set(e.target.value)
          }}
          value={state.value.title.value}
          placeholder="Optionaler Hinweistitel"
        />
      }
    >
      <Document state={state.value.content.$$value} />
    </Hint>
  )
}
