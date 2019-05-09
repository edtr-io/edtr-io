import { StatefulPluginEditorProps } from '@edtr-io/core'
import {
  EditorButton,
  UploadProgress,
  Icon,
  faRedoAlt,
  styled,
  EdtrIcon,
  edtrClose
} from '@edtr-io/editor-ui'
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

export const Temporary = styled.div<{ failed: boolean }>(props => ({
  color: props.failed ? '#f77' : '#aaa',
  display: 'inline-block',
  margin: '0 10px'
}))

export const Center = styled.div({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center'
})

export function createFilesEditor<T>(
  config: UploadConfig<T>
): React.FunctionComponent<StatefulPluginEditorProps<typeof fileState>> {
  return props => {
    const { editable, focused, state } = props
    const [uploadProgresses, setUploadProgresses] = React.useState<{
      [key: number]: number
    }>({})

    React.useEffect(() => {
      state().forEach((file, i) => {
        if (file.value.pending) {
          let canUpdate = true
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
            if (canUpdate) {
              state.items[i].set({ loaded })
            }
          })
          upload.then(uploadedFile => {
            if (canUpdate) {
              if (uploadedFile) {
                state.items[i].set({ uploaded: uploadedFile })
              } else {
                state.items[i].set(currentState => ({
                  failed: currentState.loaded
                }))
              }
            }
          })
          file.set({})
          return function cleanup() {
            canUpdate = false
          }
        }
      })
    }, [state])
    function handleFileLoaded(index: number) {
      return (loaded: LoadedFile) => {
        // only add new files here
        if (state.items.length <= index) {
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
        if (state.items.length <= index) {
          // insert as uploaded
          state.insert(index, { uploaded })
        } else {
          //update loaded file with uploaded
          state.items[index].set({ uploaded })
        }
      }
    }

    function onPaste(data: DataTransfer) {
      const items = data.items
      let files: File[] = []
      for (let i = 0; i < items.length; i++) {
        const item = items[i]
        if (item.kind === 'file') {
          const file = item.getAsFile()
          if (!file) continue
          files.push(file)
        }
      }
      if (files.length) {
        files.forEach(file => {
          state.insert(state().length, {
            pending: file
          })
        })
      }
    }

    return (
      <div
        onPaste={event => {
          onPaste(event.clipboardData)
        }}
      >
        {state.items.map((file, i) => {
          if (file.value.uploaded) {
            return (
              <React.Fragment key={i}>
                {editable && uploadProgresses[i] ? (
                  <UploadProgress progress={uploadProgresses[i]} />
                ) : null}
                <FileRenderer file={file.value.uploaded} />
              </React.Fragment>
            )
          } else {
            const tmpFile = file.value.loaded || file.value.failed
            if (tmpFile) {
              const pending = tmpFile.file
              return (
                <Temporary key={i} failed={!!file.value.failed}>
                  <Center>
                    <FileRenderer
                      file={{
                        location: tmpFile.dataUrl,
                        name: tmpFile.file.name,
                        type: parseFileType(tmpFile.file.name)
                      }}
                    />
                    <span>Fehlgeschlagen</span>
                    <span>
                      <EditorButton onClick={() => file.set({ pending })}>
                        <Icon icon={faRedoAlt} />
                      </EditorButton>
                      <EditorButton onClick={() => state.remove(i)}>
                        <EdtrIcon icon={edtrClose} />
                      </EditorButton>
                    </span>
                  </Center>
                </Temporary>
              )
            }
          }
          return null
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
      </div>
    )
  }
}
