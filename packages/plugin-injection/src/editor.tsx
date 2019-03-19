import { InjectionRenderer } from './renderer'
import * as React from 'react'
import { StatefulPluginEditorProps, StateType } from '@edtr-io/core'
import { injectionState } from '.'

export const InjectionEditor = (
  props: StatefulPluginEditorProps<typeof injectionState>
) => {
  const { focused, editable, state } = props

  return (
    <React.Fragment>
      <InjectionRenderer disableCursorEvents={editable} state={state} />
      {focused ? (
        <React.Fragment>
          <hr />
          Injection Element:
          <input
            placeholder="/12345"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              state.src.set(e.target.value)
            }}
            value={state.src()}
          />
        </React.Fragment>
      ) : null}
    </React.Fragment>
  )
}
