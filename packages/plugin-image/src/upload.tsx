import { Button, UploadProgress } from '@edtr-io/editor-ui'
// @ts-ignore
import { Uploader, UploadField } from '@navjobs/upload'
import * as React from 'react'

enum FileErrorCode {
  TOO_MANY_FILES,
  NO_FILE_SELECTED,
  BAD_EXTENSION,
  FILE_TOO_BIG,
  UPLOAD_FAILED
}
export class Upload<T = unknown> extends React.Component<UploadProps<T>> {
  private matchesAllowedExtensions(fileName: string) {
    const extension = fileName.slice(fileName.lastIndexOf('.') + 1)
    return this.props.config.allowedExtensions.indexOf(extension) >= 0
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

  private readFile(file: File) {
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

  public render() {
    const { config } = this.props
    return (
      <Uploader
        request={{
          fileName: config.paramName,
          url: config.url,
          method: 'POST',
          fields: config.getAdditionalFields
            ? config.getAdditionalFields()
            : {},
          headers: {
            Accept: 'application/json'
          }
        }}
        onComplete={({ response }: { response: T }) => {
          if (this.props.onImageUploaded) {
            const uploadedState = config.getStateFromResponse(response)
            this.props.onImageUploaded(uploadedState)
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
                  const { onImageLoaded } = this.props
                  if (onImageLoaded) {
                    this.readFile(files[0]).then(data =>
                      onImageLoaded(data as ImageLoaded)
                    )
                  }
                  onFiles(files)
                }
              }}
              uploadProps={{
                accept: 'image/*'
              }}
            >
              <Button>Durchsuchen...</Button>
              <UploadProgress {...progressProps} />
            </UploadField>
          </div>
        )}
      </Uploader>
    )
  }
}

export interface UploadProps<T> {
  config: UploadConfig<T>
  onError?: (errors: FileError[]) => void
  onImageLoaded?: (image: ImageLoaded) => void
  onImageUploaded?: (state: ImageUploaded) => void
}

export interface UploadConfig<T> {
  url: string
  maxFileSize: number
  allowedExtensions: string[]
  paramName?: string
  getAdditionalFields?: Function
  getStateFromResponse: (response: T) => { src: string }
}

export interface FileError {
  errorCode: FileErrorCode
  message: string
}

export interface ImageLoaded {
  file: File
  dataUrl: string
}

export interface ImageUploaded {
  src: string
}
