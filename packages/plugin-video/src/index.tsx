import { StatefulPlugin, StateType } from '@edtr-io/core'
import * as React from 'react'

import { VideoEditor } from './editor'
import { VideoRenderer } from './renderer'
import { createIcon, faFilm } from '@edtr-io/editor-ui'

export const videoState = StateType.string()
export const videoPlugin: StatefulPlugin<typeof videoState> = {
  //eslint-disable-next-line react/display-name
  Component: props =>
    props.editable ? <VideoEditor {...props} /> : <VideoRenderer {...props} />,
  state: videoState,
  description: 'Include Videos from Youtube, Vimeo, Wikimedia and BR.',
  icon: createIcon(faFilm),
  onPaste(clipboardData: DataTransfer) {
    const value = clipboardData.getData('text')

    const regex = /^(https?:\/\/)?(.*?(youtube\.com\/watch\?(.*&)?v=.+|youtu\.be\/.+|vimeo\.com\/.+|upload\.wikimedia\.org\/.+(\.webm|\.ogg)?|br\.de\/.+))/
    if (regex.test(value)) {
      return { state: value }
    }
  }
}
