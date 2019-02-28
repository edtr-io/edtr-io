import { createImageEditor } from './editor'
import { UploadConfig } from './upload'
export { ImageLoaded, ImageUploaded, Upload, UploadConfig } from './upload'
import { StatefulPlugin, StateType } from '@edtr-io/core'

export const imageState = StateType.object({
  src: StateType.string(''),
  href: StateType.string(''),
  target: StateType.string(''),
  rel: StateType.string(''),
  description: StateType.string('')
})
export const createImagePlugin = (
  config: ImagePluginConfig
): StatefulPlugin<typeof imageState> => {
  return {
    Component: createImageEditor(config),
    state: imageState
  }
}

export interface ImagePluginConfig {
  upload: UploadConfig
}
