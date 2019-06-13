import { EditorButton, Button } from '@edtr-io/editor-ui'
import * as React from 'react'

export const Upload: React.FunctionComponent<UploadProps> = props => {
  const input = React.createRef<HTMLInputElement>()

  const selectFile = (e: React.MouseEvent) => {
    e.preventDefault()
    if (input.current) {
      input.current.click()
    }
  }
  return (
    <React.Fragment>
      {props.inOverlay ? (
        <Button onClick={selectFile}>Durchsuchen ...</Button>
      ) : (
        <EditorButton onClick={selectFile}>Durchsuchen...</EditorButton>
      )}
      <input
        type="file"
        multiple
        accept="image/*"
        style={{ display: 'none' }}
        ref={input}
        onChange={event => {
          if (event.target.files && event.target.files.length) {
            props.onFile(event.target.files[0])
          }
        }}
      />
    </React.Fragment>
  )
}

export interface UploadProps {
  inOverlay?: boolean
  onFile: (file: File) => void
}
