import {
  isTempFile,
  number,
  object,
  string,
  upload,
  UploadHandler,
  UploadValidator,
  EditorPluginProps,
  EditorPlugin
} from '@edtr-io/plugin'

import { ImageEditor } from './editor'

/** @public */
export const imageState = object({
  src: upload(''),
  href: string(''),
  target: string(''),
  rel: string(''),
  description: string(''),
  maxWidth: number(0)
})
/** @public */
export type ImageState = typeof imageState
/** @public */
export interface ImageConfig {
  upload: UploadHandler<string>
  validate: UploadValidator
  secondInput?: 'description' | 'link'
}
/** @public */
export type ImageProps = EditorPluginProps<ImageState, ImageConfig>

/**
 * @param config - {@link ImageConfig | Plugin configuration}
 * @public
 */
export const createImagePlugin = (
  config: ImageConfig
): EditorPlugin<ImageState, ImageConfig> => {
  return {
    Component: ImageEditor,
    config,
    state: imageState,
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

      const files = getFilesFromDataTransfer(clipboardData)
      if (files.length === 1) {
        const file = files[0]
        const validation = config.validate(file)
        if (validation.valid) {
          return {
            state: {
              src: { pending: files[0] },
              href: '',
              target: '',
              rel: '',
              description: '',
              maxWidth: 0
            }
          }
        }
      }
    },
    isEmpty: serializedState => {
      return (
        (!serializedState.src || isTempFile(serializedState.src)) &&
        !serializedState.href &&
        !serializedState.description
      )
    }
  }
}

function getFilesFromDataTransfer(clipboardData: DataTransfer) {
  const items = clipboardData.files
  const files: File[] = []
  for (let i = 0; i < items.length; i++) {
    const item = items[i]
    if (!item) continue
    files.push(item)
  }
  return files
}
