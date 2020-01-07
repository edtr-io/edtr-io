import {
  string,
  object,
  migratable,
  EditorPluginProps,
  EditorPlugin
} from '@edtr-io/plugin'

import { VideoEditor } from './editor'

const stateV0 = string()
const stateV1 = object({ src: string(), alt: string() })
const videoState = migratable(stateV0).migrate(stateV1, src => {
  return { src, alt: '' }
})
export type VideoState = typeof videoState
export type VideoProps = EditorPluginProps<VideoState>

export function createVideoPlugin(): EditorPlugin<VideoState> {
  return {
    Component: VideoEditor,
    config: {},
    state: videoState,
    onPaste(clipboardData: DataTransfer) {
      const value = clipboardData.getData('text')

      const regex = /^(https?:\/\/)?(.*?(youtube\.com\/watch\?(.*&)?v=.+|youtu\.be\/.+|vimeo\.com\/.+|upload\.wikimedia\.org\/.+(\.webm|\.ogg)?|br\.de\/.+))/
      if (regex.test(value)) {
        return { state: value }
      }
    }
  }
}
