import { createIcon, faFilm } from '@edtr-io/editor-ui'
import { StatefulPlugin, string, object, migratable } from '@edtr-io/plugin'
import * as React from 'react'

import { VideoEditor } from './editor'
import { VideoRenderer } from './renderer'

const stateV0 = string()
const stateV1 = object({ url: string(), alt: string() })
export const videoState = migratable(stateV0).migrate(
  stateV1,
  previousState => {
    return { url: previousState, alt: '' }
  }
)
export const videoPlugin: StatefulPlugin<typeof videoState> = {
  //eslint-disable-next-line react/display-name
  Component: props =>
    props.editable ? <VideoEditor {...props} /> : <VideoRenderer {...props} />,
  state: videoState,
  title: 'Video',
  description: 'Binde Videos von Youtube, Vimeo, Wikimedia und BR ein.',
  icon: createIcon(faFilm),
  onPaste(clipboardData: DataTransfer) {
    const value = clipboardData.getData('text')

    const regex = /^(https?:\/\/)?(.*?(youtube\.com\/watch\?(.*&)?v=.+|youtu\.be\/.+|vimeo\.com\/.+|upload\.wikimedia\.org\/.+(\.webm|\.ogg)?|br\.de\/.+))/
    if (regex.test(value)) {
      return { state: value }
    }
  }
}
