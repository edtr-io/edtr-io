import { list, upload, EditorPlugin, EditorPluginProps } from '@edtr-io/plugin'

import { FilesEditor } from './editor'
import { onPaste } from './on-paste'
import { FilesConfig, FileType, UploadedFile } from './types'

/** @public */
export const filesState = list(
  upload<UploadedFile>({
    src: '',
    name: '',
    type: FileType.Other
  })
)
/** @public */
export type FilesState = typeof filesState
/** @public */
export type FilesProps = EditorPluginProps<FilesState, FilesConfig>

/**
 * @param config - {@link FilesConfig | Plugin configuration}
 * @public
 */
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
