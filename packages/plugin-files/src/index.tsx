import { StatefulPlugin, StateType } from '@edtr-io/core'
import { faFileAlt, createIcon } from '@edtr-io/editor-ui'
import * as React from 'react'

import { createFilesEditor } from './editor'
import { FilesRenderer } from './renderer'
import { FileType, UploadedFile, UploadFileConfig } from './types'

export const fileState = StateType.list(
  StateType.upload<UploadedFile>({
    location: '',
    name: '',
    type: FileType.Other
  })
)

export function createFilePlugin(
  config: UploadFileConfig
): StatefulPlugin<typeof fileState> {
  const FilesEditor = createFilesEditor(config.upload)
  return {
    //eslint-disable-next-line react/display-name
    Component: props =>
      props.editable ? (
        <FilesEditor {...props} />
      ) : (
        <FilesRenderer {...props} />
      ),
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
