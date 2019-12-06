/**
 * @module @edtr-io/plugin
 */
/** Comment needed because of https://github.com/christopherthielen/typedoc-plugin-external-module-name/issues/337 */
import { StateType } from '@edtr-io/internal__plugin-state'
import * as React from 'react'

import { asyncScalar } from './scalar'

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
  const state = asyncScalar<T, TempFile>(defaultState, isTempFile)
  return {
    ...state,
    init(...args) {
      const s = state.init(...args)
      return {
        ...s,
        set(
          value: FileState<T> | ((currentValue: FileState<T>) => FileState<T>)
        ) {
          s.set({
            immediate: value
          })
        },
        isPending: isTempFile(s.value) && !!s.value.pending,
        upload(file: File, handler: UploadHandler<T>): Promise<T> {
          const uploaded = handler(file)
          s.set({
            immediate: defaultState,
            resolver: (resolve, reject, next) => {
              const read = readFile(file)
              let uploadFinished = false

              read.then((loaded: LoadedFile) => {
                if (!uploadFinished) {
                  next(() => {
                    return { uploadHandled: true, loaded }
                  })
                }
              })

              uploaded
                .then(uploaded => {
                  uploadFinished = true
                  return uploaded
                })
                .then(uploaded => {
                  resolve(() => {
                    return uploaded
                  })
                })
                .catch(() => {
                  reject(() => {
                    return { uploadHandled: true, failed: file }
                  })
                })
            }
          })

          return uploaded
        }
      }
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
  const [uploading, setUploading] = React.useState(0)
  React.useEffect(() => {
    // everything uploaded already
    if (uploading >= files.length) return
    const fileState = files[uploading]

    if (
      isTempFile(fileState.value) &&
      fileState.value.pending &&
      !fileState.value.uploadHandled
    ) {
      fileState.value.uploadHandled = true

      fileState
        .upload(fileState.value.pending, uploadHandler)
        .catch(onDone)
        .then(onDone)
    }

    function onDone() {
      setUploading(currentUploading => currentUploading + 1)
    }
  }, [files, uploadHandler, uploading])
}
export type UploadHandler<T> = (file: File) => Promise<T>

export type UploadValidator<E = unknown> = (
  file: File
) => { valid: true } | { valid: false; errors: E }

export interface TempFile {
  uploadHandled?: boolean
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
