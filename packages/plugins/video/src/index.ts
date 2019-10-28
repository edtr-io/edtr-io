import { StatefulPlugin, string, object, migratable } from '@edtr-io/plugin'
import { createIcon, faFilm } from '@edtr-io/ui'

import { VideoEditor } from './editor'

const stateV0 = string()
const stateV1 = object({ src: string(), alt: string() })
export const videoState = migratable(stateV0).migrate(stateV1, src => {
  return { src, alt: '' }
})

export function createVideoPlugin(): StatefulPlugin<typeof videoState> {
  return {
    Component: VideoEditor,
    config: {},
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
}
