import { StatefulPlugin, StateType } from '@edtr-io/core'

import { createImageEditor } from './editor'
import { UploadConfig } from './upload'
import { createIcon, faImages } from '@edtr-io/editor-ui'

export const imageState = StateType.object({
  src: StateType.string(''),
  href: StateType.string(''),
  target: StateType.string(''),
  rel: StateType.string(''),
  description: StateType.string(''),
  maxWidth: StateType.number(0)
})
export const createImagePlugin = <T = unknown>(
  config: ImagePluginConfig<T>
): StatefulPlugin<typeof imageState> => {
  return {
    Component: createImageEditor(config),
    state: imageState,
    title: 'Bild',
    description:
      'Lade Bilder hoch oder verwende Bilder, die bereits online sind.',
    icon: createIcon(faImages),
    onPaste: (clipboardData: DataTransfer) => {
      const value = clipboardData.getData('text')

      if (/\.(jpe?g|png|bmp|gif|svg)$/.test(value.toLowerCase())) {
        return {
          state: {
            src: value,
            href: '',
            target: '',
            rel: '',
            description: '',
            maxWidth: 0
          }
        }
      }
    }
  }
}

export type SecondInputType = 'description' | 'link'

export interface ImagePluginConfig<T> {
  upload: UploadConfig<T>
  secondInput?: SecondInputType
}

export { ImageLoaded, ImageUploaded, Upload, UploadConfig } from './upload'
