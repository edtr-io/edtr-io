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
import { FileError, FileErrorCode, LoadedFile, FileUploadConfig } from './types'

export const Wrapper = styled.div({
  display: 'inline-block',
  margin: '0 10px'
})

export const Temporary = styled(Wrapper)({
  color: '#aaa'
})

export const Failed = styled(Wrapper)({
  color: '#f77'
})

export const Center = styled.div({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center'
})

export function createFilesEditor<T>(
  config: FileUploadConfig<T>
): React.FunctionComponent<StatefulPluginEditorProps<typeof fileState>> {
  return props => {
    const { focused, state } = props
    const [uploadProgresses, setUploadProgresses] = React.useState<{
      [key: number]: number
    }>({})

    React.useEffect(() => {
      state().forEach((file, i) => {
        const { pending } = file.value
        if (pending) {
          setUploadProgresses(currentUploadProgresses => {
            return {
              ...currentUploadProgresses,
              [i]: 0
            }
          })
          const read = readFile(pending)
          read.then((loaded: LoadedFile) => {
            file.set({ loaded })

            const upload = uploadFile(pending, config, progress => {
              setUploadProgresses(currentUploadProgresses => {
                return {
                  ...currentUploadProgresses,
                  [i]: progress
                }
              })
            })
            upload.then(uploadedFile => {
              if (uploadedFile) {
                file.set({ uploaded: uploadedFile })
              } else {
                file.set(currentState => {
                  return {
                    failed: currentState.loaded
                  }
                })
              }
            })
          })
          file.set({})
        }
      })
    }, [state])

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
            // finished uploading
            return <FileRenderer key={i} file={file.value.uploaded} />
          } else if (file.value.loaded) {
            // finished loading as DataUrl, being uploaded atm
            const tmpFile = file.value.loaded
            return (
              <Temporary key={i}>
                <Center>
                  <FileRenderer
                    file={{
                      location: tmpFile.dataUrl,
                      name: tmpFile.file.name,
                      type: parseFileType(tmpFile.file.name)
                    }}
                  />
                  {uploadProgresses[i] !== undefined ? (
                    <UploadProgress progress={uploadProgresses[i]} />
                  ) : null}
                  <EditorButton onClick={() => state.remove(i)}>
                    <EdtrIcon icon={edtrClose} />
                  </EditorButton>
                </Center>
              </Temporary>
            )
          } else if (file.value.failed) {
            const tmpFile = file.value.failed
            return (
              <Failed key={i}>
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
                    <EditorButton
                      onClick={() => file.set({ pending: tmpFile.file })}
                    >
                      <Icon icon={faRedoAlt} />
                    </EditorButton>
                    <EditorButton onClick={() => state.remove(i)}>
                      <EdtrIcon icon={edtrClose} />
                    </EditorButton>
                  </span>
                </Center>
              </Failed>
            )
          }
          return null
        })}
        {focused ? (
          <Upload
            config={config}
            onFiles={files => {
              files.forEach(file => {
                state.insert(state.items.length, {
                  pending: file
                })
              })
            }}
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
