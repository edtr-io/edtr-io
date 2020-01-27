import {
  string,
  object,
  EditorPluginProps,
  EditorPlugin
} from '@edtr-io/plugin'

import { VideoEditor } from './editor'

/** @public */
export const videoState = object({ src: string(), alt: string() })
/** @public */
export type VideoState = typeof videoState
/** @public */
export type VideoProps = EditorPluginProps<VideoState>

/** @public */
export function createVideoPlugin(): EditorPlugin<VideoState> {
  return {
    Component: VideoEditor,
    config: {},
    state: videoState,
    onPaste(clipboardData: DataTransfer) {
      const value = clipboardData.getData('text')

      const regex = /^(https?:\/\/)?(.*?(youtube\.com\/watch\?(.*&)?v=.+|youtu\.be\/.+|vimeo\.com\/.+|upload\.wikimedia\.org\/.+(\.webm|\.ogg)?|br\.de\/.+))/
      if (regex.test(value)) {
        return { state: { src: value, alt: '' } }
      }
    }
  }
}
