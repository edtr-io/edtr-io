import {
  list,
  upload,
  EditorPlugin,
  EditorPluginProps,
  ListStateType,
  UploadStateType,
} from '@edtr-io/plugin'

import { FilesEditor } from './editor'
import { FileType } from './types'
import type { FilesPluginConfig, UploadedFile } from './types'

export { FileType } from './types'

/**
 * @param config - {@link FilesConfig | Plugin configuration}
 * @public
 */
export function createFilesPlugin(
  config: FilesConfig
): EditorPlugin<FilesPluginState, FilesConfig> {
  return {
    Component: FilesEditor,
    config,
    state: list(
      upload({
        src: '',
        name: '',
        type: FileType.Other,
      })
    ),
    onFiles(files: File[]) {
      if (files.length) {
        return {
          state: files.map((file) => ({ pending: file })),
        }
      }
    },
  }
}

/** @public */
export interface FilesConfig {
  upload: FilesPluginConfig['upload']
  i18n?: Partial<FilesPluginConfig['i18n']>
}

/** @public */
export type FilesPluginState = ListStateType<UploadStateType<UploadedFile>>
export { UploadedFile }

/** @public */
export type FilesProps = EditorPluginProps<FilesPluginState, FilesConfig>
export { FilesPluginConfig }

export { parseFileType } from './upload'
