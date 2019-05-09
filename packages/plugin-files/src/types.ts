export interface DeserializedFiles {
  files?: File[]
  uploaded: UploadedFile[]
}

export interface FileState {
  pending?: File
  loaded?: LoadedFile
  uploaded?: UploadedFile
}

export interface UploadFileConfig<T> {
  upload: UploadConfig<T>
}

export interface UploadProps<T> {
  config: UploadConfig<T>
  onError?: (errors: FileError[]) => void
  onFileLoaded?: (image: LoadedFile) => void
  onFileUploaded?: (state: UploadedFile) => void
}

export interface UploadConfig<T> {
  url: string
  maxFileSize: number
  paramName?: string
  getAdditionalFields?: Function
  getStateFromResponse: (response: T) => UploadedFile
}

export enum FileErrorCode {
  TOO_MANY_FILES,
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

export interface LoadedFile {
  file: File
  dataUrl: string
}

export interface UploadedFile {
  location: string
  type: FileType
  name: string
}
