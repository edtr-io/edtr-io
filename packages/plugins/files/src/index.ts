import { list, StatefulPlugin, upload } from '@edtr-io/plugin'
import { createIcon, faFileAlt } from '@edtr-io/ui'

import { FilesEditor } from './editor'
import { FileType, UploadedFile, FilesPluginConfig } from './types'

export const fileState = list(
  upload<UploadedFile>({
    location: '',
    name: '',
    type: FileType.Other
  })
)

export function createFilesPlugin(
  config: FilesPluginConfig
): StatefulPlugin<typeof fileState, FilesPluginConfig> {
  return {
    Component: FilesEditor,
    config,
    state: fileState,
    title: 'Dateien',
    description: 'Ein Plugin für den Upload von beliebigen Dateien.',
    icon: createIcon(faFileAlt),
    onPaste: (clipboardData: DataTransfer) => {
      const files = getFilesFromDataTransfer(clipboardData)
      if (files.length) {
        return {
          state: files.map(file => ({ pending: file }))
        }
      }
    }
  }
}

export function getFilesFromDataTransfer(clipboardData: DataTransfer) {
  const items = clipboardData.files
  const files: File[] = []
  for (let i = 0; i < items.length; i++) {
    const item = items[i]
    if (!item) continue
    files.push(item)
  }
  return files
}

export * from './types'
export { parseFileType } from './upload'
