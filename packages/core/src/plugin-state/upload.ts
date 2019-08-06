import * as React from 'react'

import { StateDescriptor, StoreDeserializeHelpers } from './types'
import { StateType } from '..'

export interface UploadStateReturnType<T> {
  (): FileState<T>
  value: FileState<T>
  isPending: boolean
  upload(file: File, handler: UploadHandler<T>): Promise<T>
  set(
    value: FileState<T> | ((currentValue: FileState<T>) => FileState<T>)
  ): void
}

export function upload<T>(
  defaultState: T
): StateDescriptor<FileState<T>, FileState<T>, UploadStateReturnType<T>> {
  return Object.assign(
    (
      value: FileState<T>,
      onChange: (
        updater: (
          oldValue: FileState<T>,
          helpers: StoreDeserializeHelpers
        ) => FileState<T>
      ) => void
    ) => {
      return Object.assign(() => value, {
        value,
        isPending: isTempFile(value) && !!value.pending,
        upload(file: File, handler: UploadHandler<T>): Promise<T> {
          const read = readFile(file)
          let uploadFinished = false

          const uploaded = handler(file)
            .then(uploaded => {
              uploadFinished = true
              return uploaded
            })
            .then(uploaded => {
              onChange(() => uploaded)
              return uploaded
            })
            .catch(reason => {
              onChange(() => ({ failed: file }))
              return Promise.reject(reason)
            })

          read.then((loaded: LoadedFile) => {
            if (!uploadFinished) {
              onChange(() => ({ loaded }))
            }
          })

          return uploaded
        },
        set(
          param: FileState<T> | ((currentValue: FileState<T>) => FileState<T>)
        ) {
          onChange((currentValue: FileState<T>) => {
            if (typeof param === 'function') {
              const updater = param as ((
                currentValue: FileState<T>
              ) => FileState<T>)
              return updater(currentValue)
            } else {
              return param
            }
          })
        }
      })
    },
    {
      createInitialState: () => defaultState,
      deserialize(serialized: FileState<T>) {
        return serialized
      },
      serialize(deserialized: FileState<T>) {
        if (isTempFile(deserialized)) {
          return defaultState
        }
        return deserialized
      }
    }
  )
}

function readFile(file: File): Promise<LoadedFile> {
  return new Promise(resolve => {
    const reader = new FileReader()

    reader.onload = function(e: ProgressEvent) {
      if (!e.target) return
      const { result } = (e.target as unknown) as { result: string }
      resolve({ file, dataUrl: result })
    }

    reader.readAsDataURL(file)
  })
}

export function usePendingFileUploader<T>(
  file: UploadStateReturnType<T>,
  uploadHandler: UploadHandler<T>
) {
  usePendingFilesUploader([file], uploadHandler)
}
export function usePendingFilesUploader<T>(
  files: UploadStateReturnType<T>[],
  uploadHandler: UploadHandler<T>
) {
  const [uploading, setUploading] = React.useState([] as boolean[])
  React.useEffect(() => {
    files.forEach((fileState, i) => {
      if (
        StateType.isTempFile(fileState.value) &&
        fileState.value.pending &&
        !uploading[i]
      ) {
        setUploading(currentUploading => {
          return {
            ...currentUploading,
            [i]: true
          }
        })

        fileState
          .upload(fileState.value.pending, uploadHandler)
          .catch(onDone)
          .then(onDone)
      }

      function onDone() {
        setUploading(currentUploading => {
          return {
            ...currentUploading,
            [i]: false
          }
        })
      }
    })
  }, [files, uploadHandler, uploading])
}
export type UploadHandler<T> = (file: File) => Promise<T>

export type UploadValidator<E = unknown> = (
  file: File
) => { valid: true } | { valid: false; errors: E }

export interface TempFile {
  pending?: File
  failed?: File
  loaded?: LoadedFile
}
export type FileState<T> = T | TempFile

export function isTempFile<T>(state: FileState<T>): state is TempFile {
  const file = state as TempFile
  return !!(file.pending || file.failed || file.loaded)
}

export interface LoadedFile {
  file: File
  dataUrl: string
}
