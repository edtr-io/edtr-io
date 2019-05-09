import { StatefulPluginEditorProps } from '@edtr-io/core'
import { UploadProgress } from '@edtr-io/editor-ui'
import * as React from 'react'

import { FileRenderer } from './renderer'
import { fileState } from '.'
import { readFile, Upload, uploadFile } from './upload'
import {
  FileError,
  FileErrorCode,
  LoadedFile,
  UploadConfig,
  UploadedFile
} from './types'

export function createFilesEditor<T>(
  config: UploadConfig<T>
): React.FunctionComponent<StatefulPluginEditorProps<typeof fileState>> {
  return props => {
    const { editable, focused, state } = props
    const [uploadProgresses, setUploadProgresses] = React.useState<{
      [key: number]: number
    }>({})

    state().forEach((file, i) => {
      if (file.value.pending) {
        setUploadProgresses(currentUploadProgresses => {
          return {
            ...currentUploadProgresses,
            [i]: 0
          }
        })
        const read = readFile(file.value.pending)
        const upload = uploadFile(file.value.pending, config, progress => {
          setUploadProgresses(currentUploadProgresses => {
            return {
              ...currentUploadProgresses,
              [i]: progress
            }
          })
        })
        read.then((loaded: LoadedFile) => {
          state.items[i].set({ loaded })
        })
        upload.then(uploadedFile => {
          if (uploadedFile) {
            state.items[i].set({ uploaded: uploadedFile })
          } else {
            //TODO: what to do on error?
          }
        })
        file.set({})
      }
    })
    function handleFileLoaded(index: number) {
      return (loaded: LoadedFile) => {
        // only add new files here
        if (state.items.length < index) {
          state.insert(index, { loaded })
        } else {
          // only update if not uploaded yet
          state.items[index].set(fileState => {
            if (!fileState.uploaded) {
              return { loaded }
            }
            return fileState
          })
        }
      }
    }

    function handleFileUploaded(index: number) {
      return (uploaded: UploadedFile) => {
        if (state.items.length < index) {
          // insert as uploaded
          state.insert(index, { uploaded })
        } else {
          //update loaded file with uploaded
          state.items[index].set({ uploaded })
        }
      }
    }

    return (
      <React.Fragment>
        {state.items.map((file, i) => {
          return (
            <React.Fragment key={i}>
              {editable && uploadProgresses[i] ? (
                <UploadProgress progress={uploadProgresses[i]} />
              ) : null}
              <FileRenderer file={file.value} />
            </React.Fragment>
          )
        })}
        {focused ? (
          <Upload
            config={config}
            onFileLoaded={handleFileLoaded(state.items.length)}
            onFileUploaded={handleFileUploaded(state.items.length)}
            onError={(errors: FileError[]): void => {
              const filtered = errors.filter(
                error => error.errorCode !== FileErrorCode.UPLOAD_FAILED
              )
              if (filtered.length) {
                alert(filtered.map(error => error.message).join('\n'))
              }
            }}
          />
        ) : null}
      </React.Fragment>
    )
  }
}
