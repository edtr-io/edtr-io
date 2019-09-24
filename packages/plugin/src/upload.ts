/**
 * @module @edtr-io/plugin
 */
/** Comment needed because of https://github.com/christopherthielen/typedoc-plugin-external-module-name/issues/337 */
import { StateType } from '@edtr-io/abstract-plugin-state'
import * as React from 'react'

import { serializedScalar } from './scalar'

export interface UploadStateReturnType<T> {
  get(): FileState<T>
  value: FileState<T>
  isPending: boolean
  upload(file: File, handler: UploadHandler<T>): Promise<T>
  set(
    value: FileState<T> | ((currentValue: FileState<T>) => FileState<T>)
  ): void
}

export function upload<T>(
  defaultState: T
): StateType<FileState<T>, FileState<T>, UploadStateReturnType<T>> {
  const state = serializedScalar<FileState<T>, FileState<T>>(defaultState, {
    deserialize(serialized) {
      return serialized
    },
    serialize(deserialized) {
      if (isTempFile(deserialized)) {
        return defaultState
      }
      return deserialized
    }
  })
  return {
    ...state,
    init(...args) {
      const s = state.init(...args)
      return Object.assign(s, {
        isPending: isTempFile(s.value) && !!s.value.pending,
        upload(file: File, handler: UploadHandler<T>): Promise<T> {
          const read = readFile(file)
          let uploadFinished = false

          const uploaded = handler(file)
            .then(uploaded => {
              uploadFinished = true
              return uploaded
            })
            .then(uploaded => {
              s.value = uploaded
              return uploaded
            })
            .catch(reason => {
              s.value = { failed: file }
              return Promise.reject(reason)
            })

          read.then((loaded: LoadedFile) => {
            if (!uploadFinished) {
              s.value = { loaded }
            }
          })

          return uploaded
        }
      })
    }
  }
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
        isTempFile(fileState.value) &&
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
