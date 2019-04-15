import { StatefulPluginEditorProps } from '@edtr-io/core'
import * as React from 'react'

import { GeogebraRenderer } from './renderer'
import { geogebraState } from '.'
import {
  AutoFocusInput,
  ContainerWithConfigButton,
  Overlay
} from '@edtr-io/editor-ui'

export const GeogebraEditor = (
  props: StatefulPluginEditorProps<typeof geogebraState>
) => {
  const { focused, editable, state } = props

  return (
    <React.Fragment>
      <ContainerWithConfigButton>
        <GeogebraRenderer state={state} disableCursorEvents={editable} />
      </ContainerWithConfigButton>
      {focused ? (
        <Overlay>
          <AutoFocusInput
            label="Geogebra Link oder ID"
            placeholder="12345"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              state.set(e.target.value)
            }}
            value={state.value}
          />
        </Overlay>
      ) : null}
    </React.Fragment>
  )
}
