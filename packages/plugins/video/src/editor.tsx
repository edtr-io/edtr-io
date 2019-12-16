import { OverlayInput } from '@edtr-io/core'
import { EditorInput, PrimarySettings } from '@edtr-io/editor-ui'
import { DeprecatedPluginEditorProps } from '@edtr-io/plugin'
import * as React from 'react'

import { videoState } from '.'
import { VideoRenderer } from './renderer'

export const VideoEditor = (
  props: DeprecatedPluginEditorProps<typeof videoState> & {
    renderIntoExtendedSettings?: (children: React.ReactNode) => React.ReactNode
  }
) => {
  const { editable, focused, state } = props
  return (
    <React.Fragment>
      <VideoRenderer {...props} disableCursorEvents={editable} />
      {props.renderIntoExtendedSettings
        ? props.renderIntoExtendedSettings(
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
          )
        : null}
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
