import { EditorInput, PrimarySettings } from '@edtr-io/editor-ui'
import { StatefulPluginEditorProps } from '@edtr-io/plugin'
import * as React from 'react'

import { videoState } from '.'
import { VideoRenderer } from './renderer'

export const VideoEditor = (
  props: StatefulPluginEditorProps<typeof videoState> & {
    renderIntoExtendedSettings?: (children: React.ReactNode) => React.ReactNode
  }
) => {
  const { editable, focused, state } = props
  return (
    <React.Fragment>
      <VideoRenderer {...props} disableCursorEvents={editable} />
      {props.renderIntoExtendedSettings
        ? props.renderIntoExtendedSettings(
            <EditorInput
              label="Video URL:"
              value={state.value}
              onChange={e => {
                state.set(e.target.value)
              }}
              textfieldWidth="80%"
              editorInputWidth="100%"
            />
          )
        : null}
      {focused ? (
        <PrimarySettings>
          <EditorInput
            label="Video URL:"
            value={state.value}
            onChange={e => {
              state.set(e.target.value)
            }}
            textfieldWidth="80%"
            editorInputWidth="100%"
          />
        </PrimarySettings>
      ) : null}
    </React.Fragment>
  )
}
