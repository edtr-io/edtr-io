import { StatefulPluginEditorProps } from '@edtr-io/core'
import * as React from 'react'

import { GeogebraRenderer } from './renderer'
import { geogebraState } from '.'
import { EditorInput } from '@edtr-io/editor-ui'

export const GeogebraEditor = (
  props: StatefulPluginEditorProps<typeof geogebraState>
) => {
  const { focused, editable, state } = props

  return (
    <React.Fragment>
      <GeogebraRenderer {...props} disableCursorEvents={editable} />
      {focused ? (
        <EditorInput
          label="Geogebra Link oder ID:"
          placeholder="12345"
          value={state.value}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            state.set(e.target.value)
          }}
          textfieldWidth="70%"
          editorInputWidth="100%"
        />
      ) : null}
    </React.Fragment>
  )
}
