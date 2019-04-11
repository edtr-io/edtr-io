import { StatefulPluginEditorProps } from '@edtr-io/core'
import { Overlay, AutoFocusInput, ContainerWithConfigButton } from '@edtr-io/ui'
import * as React from 'react'

import { VideoRenderer } from './renderer'
import { videoState } from '.'

export const VideoEditor = ({
  editable,
  focused,
  state
}: StatefulPluginEditorProps<typeof videoState>) => {
  return (
    <React.Fragment>
      <ContainerWithConfigButton>
        <VideoRenderer state={state} disableCursorEvents={editable} />
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
