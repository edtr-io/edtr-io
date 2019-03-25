import { OverlayContext, StatefulPluginEditorProps } from '@edtr-io/core'
import { Overlay, AutoFocusInput } from '@edtr-io/ui'
import * as React from 'react'

import { VideoRenderer } from './renderer'
import { videoState } from '.'

export const VideoEditor = ({
  editable,
  focused,
  state
}: StatefulPluginEditorProps<typeof videoState>) => {
  const overlayContext = React.useContext(OverlayContext)
  return (
    <React.Fragment>
      <div onClick={editable ? overlayContext.show : undefined}>
        <VideoRenderer state={state} disableCursorEvents={editable} />
      </div>
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
