import { EditorInput, EditorInlineSettings } from '@edtr-io/editor-ui'
import * as React from 'react'

import { GeogebraProps } from '.'
import { GeogebraRenderer } from './renderer'

export function GeogebraEditor(props: GeogebraProps) {
  const { focused, editable, state } = props

  if (!editable) return <GeogebraRenderer {...props} />

  return (
    <React.Fragment>
      <GeogebraRenderer {...props} disableCursorEvents={editable} />
      {focused ? (
        <EditorInlineSettings>
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
        </EditorInlineSettings>
      ) : null}
    </React.Fragment>
  )
}
