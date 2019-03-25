import { StatefulPlugin, StateType } from '@edtr-io/core'

import { VideoEditor } from './editor'

export const videoState = StateType.string()
export const videoPlugin: StatefulPlugin<typeof videoState> = {
  Component: VideoEditor,
  state: videoState,
  onPaste(clipboardData: DataTransfer) {
    const value = clipboardData.getData('text')

    const regex = /^(https?:\/\/)?(.*?(youtube\.com\/watch\?v=.+|youtu\.be\/.+|vimeo\.com\/.+|upload\.wikimedia\.org\/.+(\.webm|\.ogg)?|br\.de\/.+))/
    if (regex.test(value)) {
      return { state: value }
    }
  }
}
