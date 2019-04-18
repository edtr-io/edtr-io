import { StatefulPluginEditorProps } from '@edtr-io/core'
import {
  Overlay,
  AutoFocusInput,
  ContainerWithConfigButton
} from '@edtr-io/editor-ui'
import * as React from 'react'

import { VideoRenderer } from './renderer'
import { videoState } from '.'

export const VideoEditor = (
  props: StatefulPluginEditorProps<typeof videoState>
) => {
  const { editable, focused, state } = props
  return (
    <React.Fragment>
      <ContainerWithConfigButton>
        <VideoRenderer {...props} disableCursorEvents={editable} />
      </ContainerWithConfigButton>
      {focused ? (
        <Overlay>
          <AutoFocusInput
            label="Video URL"
            value={state.value}
            onChange={e => {
              state.set(e.target.value)
            }}
          />
        </Overlay>
      ) : null}
    </React.Fragment>
  )
}
