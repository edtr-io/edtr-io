import { StatefulPlugin, StateType } from '@edtr-io/core'

import { createImageEditor } from './editor'
import { UploadConfig } from './upload'

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
    onPaste: (clipboardData: DataTransfer) => {
      const value = clipboardData.getData('text')

      if (/\.(jpe?g|png|bmp|gif|svg)$/.test(value)) {
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

export interface ImagePluginConfig<T> {
  upload: UploadConfig<T>
}

export { ImageLoaded, ImageUploaded, Upload, UploadConfig } from './upload'
