import { StatefulPlugin, StateType } from '@edtr-io/core'

import { createFileEditor } from './editor'
import { faFileAlt, createIcon } from '@edtr-io/editor-ui'
import { DeserializedFiles, UploadFileConfig } from './types'

export const fileState = StateType.scalar<DeserializedFiles>({ uploaded: [] })

export function createFilePlugin<T = unknown>(
  config: UploadFileConfig<T>
): StatefulPlugin<typeof fileState> {
  return {
    Component: createFileEditor(config.upload),
    state: fileState,
    title: 'Dateien',
    description: 'Ein Plugin für den Upload von beliebigen Dateien.',
    icon: createIcon(faFileAlt),
    onPaste: (clipboardData: DataTransfer) => {
      const items = clipboardData.items
      let files: File[] = []
      for (let i = 0; i < items.length; i++) {
        const item = items[i]
        if (item.kind === 'file') {
          const file = item.getAsFile()
          if (!file) continue
          files.push(file)
        }
      }
      if (files.length) {
        return {
          state: {
            files: files,
            uploaded: []
          }
        }
      }
    }
  }
}
