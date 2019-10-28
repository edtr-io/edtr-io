import { UploadHandler } from '@edtr-io/plugin'

export interface UploadedFile {
  location: string
  type: FileType
  name: string
}

export interface UploadFileConfig {
  upload: UploadHandler<UploadedFile>
}

export interface UploadProps {
  onFiles: (files: File[]) => void
}

export interface FileUploadConfig<T> {
  url: string
  maxFileSize: number
  paramName?: string
  getAdditionalFields?: Function
  getStateFromResponse: (response: T) => UploadedFile
}

export enum FileErrorCode {
  NO_FILE_SELECTED,
  FILE_TOO_BIG,
  UPLOAD_FAILED
}

export interface FileError {
  errorCode: FileErrorCode
  message: string
}

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
