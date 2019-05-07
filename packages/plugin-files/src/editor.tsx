import { StatefulPluginEditorProps } from '@edtr-io/core'
import { UploadProgress } from '@edtr-io/ui'
import * as React from 'react'

import { FileRenderer } from './renderer'
import { fileState } from '.'
import { parseFileType, readFile, Upload, uploadFile } from './upload'
import {
  FileError,
  FileErrorCode,
  LoadedFile,
  UploadConfig,
  UploadedFile
} from './types'

export function createFileEditor<T>(
  config: UploadConfig<T>
): React.FunctionComponent<StatefulPluginEditorProps<typeof fileState>> {
  return props => {
    const { editable, focused, state } = props
    function handleFileLoaded(loaded: LoadedFile) {
      const rest = state.value.files ? state.value.files.slice(1) : undefined
      state.set({
        files: rest,
        uploaded: [
          ...state.value.uploaded,
          {
            name: loaded.file.name,
            type: parseFileType(loaded.file.name),
            location: loaded.dataUrl
          }
        ]
      })
    }
    function handleFileUploaded(uploaded: UploadedFile) {
      state.set({
        files: state.value.files ? state.value.files.slice(1) : undefined,
        uploaded: [...state.value.uploaded, uploaded]
      })
    }

    const uploading = React.useRef(false)
    const [progress, setProgress] = React.useState(0)
    React.useEffect(() => {
      if (!uploading.current && state.value.files && state.value.files.length) {
        const nextFile = state.value.files[0]
        uploading.current = true
        const read = readFile(nextFile)
        const upload = uploadFile(nextFile, config, setProgress)
        read.then(readFile => {
          if (uploading) {
            handleFileLoaded(readFile)
          }
        })
        upload.then(uploadedFile => {
          uploading.current = false
          if (uploadedFile) {
            handleFileUploaded(uploadedFile)
          } else {
            //TODO: what to do on error?
          }
        })
      }
    }, [state])

    return (
      <React.Fragment>
        {editable && state.value.files ? (
          <UploadProgress progress={progress} />
        ) : null}
        <FileRenderer {...props} />
        {focused ? (
          <Upload
            config={config}
            onFileLoaded={handleFileLoaded}
            onFileUploaded={handleFileUploaded}
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
