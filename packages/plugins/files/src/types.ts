import { UploadHandler } from '@edtr-io/plugin'

/** @public */
export interface UploadedFile {
  src: string
  type: FileType
  name: string
}

/** @public */
export interface FilesPluginConfig {
  upload: UploadHandler<UploadedFile>
  i18n: {
    label: string
    failedUploadMessage: string
  }
}

/** @public */
export interface UploadProps {
  config: FilesPluginConfig
  onFiles: (files: File[]) => void
}

/** @public */
export interface FileUploadConfig<T> {
  url: string
  maxFileSize: number
  paramName?: string
  getAdditionalFields?: Function
  getStateFromResponse: (response: T) => UploadedFile
}

/** @public */
export enum FileErrorCode {
  NO_FILE_SELECTED,
  FILE_TOO_BIG,
  UPLOAD_FAILED
}

/** @public */
export interface FileError {
  errorCode: FileErrorCode
  message: string
}

/** @public */
export enum FileType {
  Image = 'image',
  Archive = 'archive',
  Audio = 'audio',
  Video = 'video',
  PDF = 'pdf',
  Word = 'word',
  PowerPoint = 'powerpoint',
  Excel = 'excel',
  Other = 'other'
}
