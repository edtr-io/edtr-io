import * as React from 'react'

import { StateType } from './internal-plugin-state'
import { asyncScalar } from './scalar'

/**
 * @param defaultState - The default state
 * @public
 */
export function upload<T>(defaultState: T): UploadStateType<T> {
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
          s.set(value)
        },
        isPending: isTempFile(s.value) && !!s.value.pending,
        upload(file: File, handler: UploadHandler<T>): Promise<T> {
          const uploaded = handler(file)
          s.set(defaultState, (resolve, reject, next) => {
            const read = readFile(file)
            let uploadFinished = false

            void read.then((loaded: LoadedFile) => {
              if (!uploadFinished) {
                next(() => {
                  return { uploadHandled: true, loaded }
                })
              }
            })

            uploaded
              .then((uploaded) => {
                uploadFinished = true
                return uploaded
              })
              .then((uploaded) => {
                resolve(() => {
                  return uploaded
                })
              })
              .catch(() => {
                reject(() => {
                  return { uploadHandled: true, failed: file }
                })
              })
          })

          return uploaded
        },
      }
    },
  }
}

/** @public */
export type UploadStateType<T> = StateType<
  FileState<T>,
  FileState<T>,
  UploadStateReturnType<T>
>

/** @public */
export interface UploadStateReturnType<T> {
  get(): FileState<T>
  value: FileState<T>
  isPending: boolean
  upload(file: File, handler: UploadHandler<T>): Promise<T>
  set(
    value: FileState<T> | ((currentValue: FileState<T>) => FileState<T>)
  ): void
}

function readFile(file: File): Promise<LoadedFile> {
  return new Promise((resolve) => {
    const reader = new FileReader()

    reader.onload = function (e: ProgressEvent) {
      if (!e.target) return
      const { result } = e.target as unknown as { result: string }
      resolve({ file, dataUrl: result })
    }

    reader.readAsDataURL(file)
  })
}

/**
 * @param file - The {@link UploadStateReturnType | upload state type}
 * @param uploadHandler - The {@link UploadHandler | upload handler}
 * @public
 */
export function usePendingFileUploader<T>(
  file: UploadStateReturnType<T>,
  uploadHandler: UploadHandler<T>
) {
  usePendingFilesUploader([file], uploadHandler)
}
/**
 * @param files - The {@link UploadStateReturnType | upload state type}
 * @param uploadHandler - The {@link UploadHandler | upload handler}
 * @public
 */
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

      void fileState
        .upload(fileState.value.pending, uploadHandler)
        .catch(onDone)
        .then(onDone)
    }

    function onDone() {
      setUploading((currentUploading) => currentUploading + 1)
    }
  }, [files, uploadHandler, uploading])
}
/** @public */
export type UploadHandler<T> = (file: File) => Promise<T>

/** @public */
export type UploadValidator<E = unknown> = (
  file: File
) => { valid: true } | { valid: false; errors: E }

/** @public */
export interface TempFile {
  uploadHandled?: boolean
  pending?: File
  failed?: File
  loaded?: LoadedFile
}
/** @public */
export type FileState<T> = T | TempFile

/**
 * @param state - The current {@link FileState | state}
 * @public
 */
export function isTempFile<T>(state: FileState<T>): state is TempFile {
  const file = state as TempFile
  return !!(file.pending || file.failed || file.loaded)
}

/** @public */
export interface LoadedFile {
  file: File
  dataUrl: string
}
