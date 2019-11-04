import {
  isTempFile,
  number,
  object,
  StatefulPlugin,
  string,
  upload,
  UploadHandler,
  UploadValidator
} from '@edtr-io/plugin'
import { createIcon, faImages } from '@edtr-io/ui'

import { createImageEditor } from './editor'

export const imageState = object({
  src: upload(''),
  href: string(''),
  target: string(''),
  rel: string(''),
  description: string(''),
  maxWidth: number(0)
})
export const createImagePlugin = (
  config: ImagePluginConfig
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

export type SecondInputType = 'description' | 'link'

export interface ImagePluginConfig {
  upload: UploadHandler<string>
  validate: UploadValidator
  secondInput?: SecondInputType
}

export { Upload } from './upload'
