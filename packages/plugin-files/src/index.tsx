import * as React from 'react'
import {
  StatefulPlugin,
  StatefulPluginEditorProps,
  StateType
} from '@edtr-io/core'

import { createFilesEditor } from './editor'
import { faFileAlt, createIcon } from '@edtr-io/editor-ui'
import { FileState, UploadFileConfig } from './types'
import { FilesRenderer } from './renderer'

export const fileState = StateType.list(
  StateType.serializedScalar<FileState, FileState>(
    {},
    {
      // deserialize as it is, which allows Files in onPaste
      deserialize: s => s,
      // only save the uploaded locations
      serialize: ({ uploaded }) => ({ uploaded })
    }
  )
)

export function createFilePlugin<T = unknown>(
  config: UploadFileConfig<T>
): StatefulPlugin<typeof fileState> {
  const Component: React.FunctionComponent<
    StatefulPluginEditorProps<typeof fileState>
  > = props => {
    const FileComponent = props.editable
      ? createFilesEditor(config.upload)
      : FilesRenderer
    return <FileComponent {...props} />
  }
  return {
    Component,
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
          state: files.map(file => ({ pending: file }))
        }
      }
    }
  }
}
