import { Button, EditorButton, UploadProgress } from '@edtr-io/editor-ui'
// @ts-ignore
import { Uploader, UploadField, UploadRequest } from '@navjobs/upload'
import * as React from 'react'

export enum FileErrorCode {
  TOO_MANY_FILES,
  NO_FILE_SELECTED,
  BAD_EXTENSION,
  FILE_TOO_BIG,
  UPLOAD_FAILED
}

export function readFile(file: File): Promise<LoadedFile> {
  return new Promise(resolve => {
    const reader = new FileReader()

    reader.onload = function(e: ProgressEvent) {
      // @ts-ignore FIXME
      const dataUrl = e.target.result
      resolve({ file, dataUrl })
    }

    reader.readAsDataURL(file)
  })
}

export class Upload<T = unknown> extends React.Component<UploadProps<T>> {
  private matchesAllowedExtensions(fileName: string) {
    if (this.props.config.allowedExtensions === undefined) {
      return true
    } else {
      const extension = fileName.slice(fileName.lastIndexOf('.') + 1)
      return this.props.config.allowedExtensions.indexOf(extension) >= 0
    }
  }

  private handleErrors(errors: FileErrorCode[]): FileError[] {
    return errors.map(error => ({
      errorCode: error,
      message: this.errorCodeToMessage(error)
    }))
  }
  private defaultOnError(errors: FileError[]): void {
    alert(errors.map(error => error.message).join('\n'))
  }

  private errorCodeToMessage(error: FileErrorCode) {
    switch (error) {
      case FileErrorCode.TOO_MANY_FILES:
        return 'You can only upload one file'
      case FileErrorCode.NO_FILE_SELECTED:
        return 'No file selected'
      case FileErrorCode.BAD_EXTENSION:
        return 'Not an accepted file type'
      case FileErrorCode.FILE_TOO_BIG:
        return 'Filesize is too big'
      case FileErrorCode.UPLOAD_FAILED:
        return 'Error while uploading'
    }
  }

  private validateFiles(
    files: FileList
  ): { valid: boolean; errors: FileError[] } {
    let valid = true,
      uploadErrors: FileErrorCode[] = []

    if (!files || !files[0]) {
      uploadErrors = [...uploadErrors, FileErrorCode.NO_FILE_SELECTED]
      valid = false
    } else {
      if (files.length > 1) {
        uploadErrors = [...uploadErrors, FileErrorCode.TOO_MANY_FILES]
        valid = false
      }
      const file = files[0]
      if (!this.matchesAllowedExtensions(file.name)) {
        uploadErrors = [...uploadErrors, FileErrorCode.BAD_EXTENSION]
        valid = false
      }
      if (file.size > this.props.config.maxFileSize) {
        uploadErrors = [...uploadErrors, FileErrorCode.FILE_TOO_BIG]
        valid = false
      }
    }

    return {
      valid: valid,
      errors: this.handleErrors(uploadErrors)
    }
  }

  public render() {
    const { config } = this.props
    return (
      <Uploader
        request={createRequest(config)}
        onComplete={({ response }: { response: T }) => {
          if (this.props.onFileUploaded) {
            const uploadedState = config.getStateFromResponse(response)
            this.props.onFileUploaded(uploadedState)
          }
        }}
        onError={() => {
          const errors = this.handleErrors([FileErrorCode.UPLOAD_FAILED])
          if (this.props.onError) {
            this.props.onError(errors)
          } else {
            this.defaultOnError(errors)
          }
        }}
        uploadOnSelection
      >
        {({
          onFiles,
          ...progressProps
        }: {
          onFiles: Function
          progress?: number
          complete?: boolean
          canceled?: boolean
          failed?: boolean
        }) => (
          <div>
            <UploadField
              onFiles={(files: FileList) => {
                const validation = this.validateFiles(files)
                if (!validation.valid) {
                  if (this.props.onError) {
                    this.props.onError(validation.errors)
                  } else {
                    this.defaultOnError(validation.errors)
                  }
                } else {
                  const { onFileLoaded } = this.props
                  if (onFileLoaded) {
                    readFile(files[0]).then(data =>
                      onFileLoaded(data as LoadedFile)
                    )
                  }
                  onFiles(files)
                }
              }}
              uploadProps={{
                accept: '*' // FIXME: image/*
              }}
            >
              {this.props.inOverlay ? (
                <Button>Durchsuchen ...</Button>
              ) : (
                <EditorButton>Durchsuchen...</EditorButton>
              )}

              <UploadProgress {...progressProps} />
            </UploadField>
          </div>
        )}
      </Uploader>
    )
  }
}

export interface UploadProps<T> {
  inOverlay?: boolean
  config: UploadConfig<T>
  onError?: (errors: FileError[]) => void
  onFileLoaded?: (image: LoadedFile) => void
  onFileUploaded?: (state: UploadedFile) => void
}

export interface UploadConfig<T> {
  url: string
  maxFileSize: number
  allowedExtensions?: string[]
  paramName?: string
  getAdditionalFields?: Function
  getStateFromResponse: (response: T) => UploadedFile
}

export interface FileError {
  errorCode: FileErrorCode
  message: string
}

export function createRequest<T>(config: UploadConfig<T>) {
  return {
    fileName: config.paramName,
    url: config.url,
    method: 'POST',
    fields: config.getAdditionalFields ? config.getAdditionalFields() : {},
    headers: {
      Accept: 'application/json'
    }
  }
}

export function uploadFile<T>(
  file: File,
  config: UploadConfig<T>,
  onProgress?: (progress: number) => void
): Promise<UploadedFile | undefined> {
  return UploadRequest({
    request: createRequest(config),
    files: [file],
    progress: (value: number) => {
      if (onProgress) {
        onProgress(value)
      }
    }
  }).then(({ response, error }: { response: T; error: boolean }) => {
    if (!error) {
      return config.getStateFromResponse(response)
    }
  })
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
  type?: FileType
  name?: string
}

export function parseFileType(name: string): FileType {
  const normalized = name.toLowerCase()
  if (/\.(zip|rar|tar|7z)$/.test(normalized)) {
    return FileType.Archive
  }
  if (/\.(mp3|wav|wma)?$/.test(normalized)) {
    return FileType.Audio
  }
  if (/\.(jpe?g|png|bmp|gif|svg)$/.test(normalized)) {
    return FileType.Image
  }
  if (/\.pdf$/.test(normalized)) {
    return FileType.PDF
  }
  if (/\.(pptx?|odp)$/.test(normalized)) {
    return FileType.PowerPoint
  }
  if (/\.(mov|avi|wmv|flv|3gp|mp4|mpg|webm)$/.test(normalized)) {
    return FileType.Video
  }
  if (/\.(docx?|odt)$/.test(normalized)) {
    return FileType.Word
  }
  if (/\.(xlsx?|ods)?$/.test(normalized)) {
    return FileType.Excel
  }

  return FileType.Other
}
