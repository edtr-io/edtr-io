import { OverlayInput } from '@edtr-io/core'
import { EditorInput, EditorInlineSettings } from '@edtr-io/editor-ui'
import * as React from 'react'

import { VideoProps } from '.'
import { VideoRenderer } from './renderer'

export const VideoEditor = (props: VideoProps) => {
  const { editable, focused, state } = props

  if (!editable) return <VideoRenderer {...props} />

  return (
    <React.Fragment>
      <VideoRenderer {...props} disableCursorEvents={editable} />
      {props.renderIntoSettings(
        <React.Fragment>
          <OverlayInput
            label={props.config.i18n.src.label}
            value={state.src.value}
            onChange={(e) => {
              state.src.set(e.target.value)
            }}
          />
          <OverlayInput
            label={props.config.i18n.alt.label}
            value={state.alt.value}
            onChange={(e) => {
              state.alt.set(e.target.value)
            }}
          />
        </React.Fragment>
      )}
      {focused ? (
        <EditorInlineSettings>
          <EditorInput
            label={props.config.i18n.src.label}
            value={state.src.value}
            onChange={(e) => {
              state.src.set(e.target.value)
            }}
            width="80%"
            inputWidth="100%"
            ref={props.autofocusRef}
          />
        </EditorInlineSettings>
      ) : null}
    </React.Fragment>
  )
}
