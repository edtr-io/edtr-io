import { StatefulPlugin, StateType } from '@edtr-io/core'

import { createImageEditor } from './editor'
import { UploadConfig } from './upload'

export const imageState = StateType.object({
  src: StateType.string(''),
  href: StateType.string(''),
  target: StateType.string(''),
  rel: StateType.string(''),
  description: StateType.string('')
})
export const createImagePlugin = <T = unknown>(
  config: ImagePluginConfig<T>
): StatefulPlugin<typeof imageState> => {
  return {
    Component: createImageEditor(config),
    state: imageState
  }
}

export interface ImagePluginConfig<T> {
  upload: UploadConfig<T>
}

export { ImageLoaded, ImageUploaded, Upload, UploadConfig } from './upload'
