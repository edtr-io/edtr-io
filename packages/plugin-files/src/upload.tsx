import { EditorButton } from '@edtr-io/editor-ui'
// @ts-ignore
import { UploadField, UploadRequest } from '@navjobs/upload'
import * as React from 'react'
import {
  FileError,
  FileErrorCode,
  FileType,
  LoadedFile,
  FileUploadConfig,
  UploadedFile,
  UploadProps
} from './types'

function createRequest<T>(config: FileUploadConfig<T>) {
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

export function uploadFile<T>(
  file: File,
  config: FileUploadConfig<T>,
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
export class Upload<T = unknown> extends React.Component<UploadProps<T>> {
  private handleErrors(errors: FileErrorCode[]): FileError[] {
    return errors.map(error => ({
      errorCode: error,
      message: this.errorCodeToMessage(error)
    }))
  }
  private errorCodeToMessage(error: FileErrorCode) {
    switch (error) {
      case FileErrorCode.NO_FILE_SELECTED:
        return 'Keine Datei ausgewählt'
      case FileErrorCode.FILE_TOO_BIG:
        return 'Die Datei ist zu groß'
      case FileErrorCode.UPLOAD_FAILED:
        return 'Beim Hochladen ist ein Fehler aufgetreten.'
    }
  }

  private validateFiles(
    files: FileList
  ): { valid: boolean[]; errors: FileError[] } {
    let valid: boolean[] = [],
      uploadErrors: FileErrorCode[] = []

    if (!files || !files[0]) {
      uploadErrors = [...uploadErrors, FileErrorCode.NO_FILE_SELECTED]
    } else {
      for (let i = 0; i < files.length; i++) {
        if (files[i].size > this.props.config.maxFileSize) {
          uploadErrors = [...uploadErrors, FileErrorCode.FILE_TOO_BIG]
          valid = [...valid, false]
        } else {
          valid = [...valid, true]
        }
      }
    }
    return {
      valid: valid,
      errors: this.handleErrors(uploadErrors)
    }
  }

  public render() {
    return (
      <UploadField
        onFiles={(fileList: FileList) => {
          let files: File[] = []

          const validation = this.validateFiles(fileList)
          if (
            !validation.valid.length ||
            !validation.valid.every(bool => bool)
          ) {
            if (this.props.onError) {
              this.props.onError(validation.errors)
            }
          }
          validation.valid.forEach((valid, i) => {
            if (valid) files.push(fileList[i])
          })
          if (files && this.props.onFiles) {
            this.props.onFiles(files)
          }
        }}
        uploadProps={{
          multiple: true
        }}
      >
        <EditorButton>Durchsuchen...</EditorButton>
      </UploadField>
    )
  }
}
