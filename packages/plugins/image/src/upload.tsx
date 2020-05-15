import { OverlayButton } from '@edtr-io/core'
import { EditorButton } from '@edtr-io/editor-ui'
import * as React from 'react'

import { ImagePluginConfig } from '.'

export function Upload(props: UploadProps) {
  const input = React.useRef<HTMLInputElement>(null)
  return (
    <React.Fragment>
      {props.inOverlay ? (
        <OverlayButton onClick={selectFile} label={props.config.i18n.label} />
      ) : (
        <EditorButton onClick={selectFile}>
          {props.config.i18n.label}
        </EditorButton>
      )}
      <input
        type="file"
        multiple
        accept="image/*"
        style={{ display: 'none' }}
        ref={input}
        onChange={(event) => {
          if (event.target.files && event.target.files.length) {
            props.onFile(event.target.files[0])
          }
        }}
      />
    </React.Fragment>
  )

  function selectFile(e: React.MouseEvent) {
    e.preventDefault()
    if (input.current) {
      input.current.click()
    }
  }
}

export interface UploadProps {
  config: ImagePluginConfig
  inOverlay?: boolean
  onFile: (file: File) => void
}
