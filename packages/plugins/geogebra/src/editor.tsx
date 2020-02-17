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
            label={props.config.i18n.label}
            placeholder={props.config.i18n.placeholder}
            value={state.value}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              state.set(e.target.value)
            }}
            inputWidth="70%"
            width="100%"
            ref={props.autofocusRef}
          />
        </EditorInlineSettings>
      ) : null}
    </React.Fragment>
  )
}
