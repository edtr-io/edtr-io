import { Plugin, string, object, migratable } from '@edtr-io/plugin'
import { createIcon, faFilm } from '@edtr-io/ui'
import * as React from 'react'

import { VideoEditor } from './editor'
import { VideoRenderer } from './renderer'

const stateV0 = string()
const stateV1 = object({ src: string(), alt: string() })
export const videoState = migratable(stateV0).migrate(stateV1, src => {
  return { src, alt: '' }
})

export const videoPlugin: Plugin<typeof videoState> = {
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
