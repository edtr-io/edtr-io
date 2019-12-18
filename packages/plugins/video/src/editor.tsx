import { OverlayInput } from '@edtr-io/core'
import { EditorInput, PrimarySettings } from '@edtr-io/editor-ui'
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
            label="Video URL:"
            value={state.src.value}
            onChange={e => {
              state.src.set(e.target.value)
            }}
          />
          <OverlayInput
            label="alternativer Text:"
            value={state.alt.value}
            onChange={e => {
              state.alt.set(e.target.value)
            }}
          />
        </React.Fragment>
      )}
      {focused ? (
        <PrimarySettings>
          <EditorInput
            label="Video URL:"
            value={state.src.value}
            onChange={e => {
              state.src.set(e.target.value)
            }}
            textfieldWidth="80%"
            editorInputWidth="100%"
            ref={props.defaultFocusRef}
          />
        </PrimarySettings>
      ) : null}
    </React.Fragment>
  )
}
