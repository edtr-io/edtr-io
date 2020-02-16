import {
  list,
  upload,
  EditorPlugin,
  EditorPluginProps,
  ListStateType,
  UploadStateType
} from '@edtr-io/plugin'

import { FilesEditor } from './editor'
import { onPaste } from './on-paste'
import { FilesConfig, FileType, UploadedFile } from './types'

/** @public */
export type FilesState = ListStateType<UploadStateType<UploadedFile>>
/** @public */
export type FilesProps = EditorPluginProps<FilesState, FilesConfig>

const filesState: FilesState = list(
  upload({
    src: '',
    name: '',
    type: FileType.Other
  })
)

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
