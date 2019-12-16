import { EditorInput, PrimarySettings } from '@edtr-io/editor-ui'
import { DeprecatedPluginEditorProps } from '@edtr-io/plugin'
import * as React from 'react'

import { geogebraState } from '.'
import { GeogebraRenderer } from './renderer'

export const GeogebraEditor = (
  props: DeprecatedPluginEditorProps<typeof geogebraState>
) => {
  const { focused, editable, state } = props

  return (
    <React.Fragment>
      <GeogebraRenderer {...props} disableCursorEvents={editable} />
      {focused ? (
        <PrimarySettings>
          <EditorInput
            label="Geogebra Link oder ID:"
            placeholder="12345"
            value={state.value}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              state.set(e.target.value)
            }}
            textfieldWidth="70%"
            editorInputWidth="100%"
            ref={props.defaultFocusRef}
          />
        </PrimarySettings>
      ) : null}
    </React.Fragment>
  )
}
