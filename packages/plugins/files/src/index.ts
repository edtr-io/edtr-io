import { list, upload, EditorPlugin, EditorPluginProps } from '@edtr-io/plugin'

import { FilesEditor } from './editor'
import { onPaste } from './on-paste'
import { FilesConfig, FileType, UploadedFile } from './types'

const filesState = list(
  upload<UploadedFile>({
    location: '',
    name: '',
    type: FileType.Other
  })
)
export type FilesState = typeof filesState
export type FilesProps = EditorPluginProps<FilesState, FilesConfig>

export function createFilesPlugin(
  config: FilesConfig
): EditorPlugin<FilesState, FilesConfig> {
  return {
    Component: FilesEditor,
    config,
    state: filesState,
    onPaste
  }
}

export * from './types'
export { parseFileType } from './upload'
