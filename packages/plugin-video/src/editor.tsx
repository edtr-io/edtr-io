import { StatefulPluginEditorProps } from '@edtr-io/core'
import { EditorInput } from '@edtr-io/editor-ui'
import * as React from 'react'

import { VideoRenderer } from './renderer'
import { videoState } from '.'

export const VideoEditor = (
  props: StatefulPluginEditorProps<typeof videoState>
) => {
  const { editable, focused, state } = props
  return (
    <React.Fragment>
      <VideoRenderer {...props} disableCursorEvents={editable} />
      {focused ? (
        <EditorInput
          label="Video URL:"
          value={state.value}
          onChange={e => {
            state.set(e.target.value)
          }}
          textfieldWidth="80%"
          editorInputWidth="100%"
        />
      ) : null}
    </React.Fragment>
  )
}
