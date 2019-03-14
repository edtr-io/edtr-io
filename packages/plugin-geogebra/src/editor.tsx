import { StatefulPluginEditorProps } from '@edtr-io/core'
import * as React from 'react'

import { GeogebraRenderer } from './renderer'
import { geogebraState } from '.'

export const GeogebraEditor = (
  props: StatefulPluginEditorProps<typeof geogebraState>
) => {
  const { focused, editable, state } = props

  return (
    <React.Fragment>
      <GeogebraRenderer state={state} disableCursorEvents={editable} />
      {focused ? (
        <React.Fragment>
          <hr />
          Geogebra ID:
          <input
            placeholder="12345"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              state.set(e.target.value)
            }}
            value={state.value}
          />
        </React.Fragment>
      ) : null}
    </React.Fragment>
  )
}
