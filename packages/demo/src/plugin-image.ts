import { LoadedFile, UploadValidator } from '@edtr-io/plugin'
import { createImagePlugin } from '@edtr-io/plugin-image'

const MAX_FILE_SIZE = 2 * 1024 * 1024
const ALLOWED_EXTENSIONS = ['gif', 'jpg', 'jpeg', 'png', 'svg']

enum FileErrorCode {
  TOO_MANY_FILES,
  NO_FILE_SELECTED,
  BAD_EXTENSION,
  FILE_TOO_BIG,
  UPLOAD_FAILED
}

export interface FileError {
  errorCode: FileErrorCode
  message: string
}

function matchesAllowedExtensions(fileName: string) {
  const extension = fileName.toLowerCase().slice(fileName.lastIndexOf('.') + 1)
  return ALLOWED_EXTENSIONS.includes(extension)
}

function handleErrors(errors: FileErrorCode[]): FileError[] {
  return errors.map(error => ({
    errorCode: error,
    message: errorCodeToMessage(error)
  }))
}
function onError(errors: FileError[]): void {
  alert(errors.map(error => error.message).join('\n'))
}

function errorCodeToMessage(error: FileErrorCode) {
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

export const validateFile: UploadValidator<FileError[]> = file => {
  let uploadErrors: FileErrorCode[] = []

  if (!file) {
    uploadErrors = [...uploadErrors, FileErrorCode.NO_FILE_SELECTED]
  } else if (!matchesAllowedExtensions(file.name)) {
    uploadErrors = [...uploadErrors, FileErrorCode.BAD_EXTENSION]
  } else if (file.size > MAX_FILE_SIZE) {
    uploadErrors = [...uploadErrors, FileErrorCode.FILE_TOO_BIG]
  } else {
    return {
      valid: true
    }
  }

  return {
    valid: false,
    errors: handleErrors(uploadErrors)
  }
}

export function mockUploadImageHandler(file: File): Promise<string> {
  const validation = validateFile(file)
  if (!validation.valid) {
    onError(validation.errors)
    return Promise.reject(validation.errors)
  }

  return readFile(file).then(loaded => {
    return loaded.dataUrl
  })
}

export function readFile(file: File): Promise<LoadedFile> {
  return new Promise(resolve => {
    const reader = new FileReader()

    reader.onload = function(e: ProgressEvent) {
      if (!e.target) return
      const { result } = (e.target as unknown) as { result: string }
      const dataUrl = result
      // Simulate upload time
      setTimeout(() => resolve({ file, dataUrl }), 1000)
    }

    reader.readAsDataURL(file)
  })
}

export const imagePlugin = createImagePlugin({
  upload: mockUploadImageHandler,
  validate: validateFile,
  secondInput: 'description'
})
