import { EditorButton } from '@edtr-io/editor-ui'
import * as React from 'react'

import { FileType, UploadProps } from './types'

/**
 * @param name - File name
 * @public
 */
export function parseFileType(name: string): FileType {
  const normalized = name.toLowerCase()
  if (/\.(zip|rar|tar|7z)$/.test(normalized)) {
    return FileType.Archive
  }
  if (/\.(mp3|wav|wma)?$/.test(normalized)) {
    return FileType.Audio
  }
  if (/\.(jpe?g|png|bmp|gif|svg)$/.test(normalized)) {
    return FileType.Image
  }
  if (normalized.endsWith('.pdf')) {
    return FileType.PDF
  }
  if (/\.(pptx?|odp)$/.test(normalized)) {
    return FileType.PowerPoint
  }
  if (/\.(mov|avi|wmv|flv|3gp|mp4|mpg|webm)$/.test(normalized)) {
    return FileType.Video
  }
  if (/\.(docx?|odt)$/.test(normalized)) {
    return FileType.Word
  }
  if (/\.(xlsx?|ods)?$/.test(normalized)) {
    return FileType.Excel
  }

  return FileType.Other
}

export function Upload(props: UploadProps) {
  const input = React.useRef<HTMLInputElement>(null)
  return (
    <React.Fragment>
      <EditorButton
        onClick={e => {
          e.preventDefault()
          if (input.current) {
            input.current.click()
          }
        }}
      >
        {props.config.i18n.label}
      </EditorButton>
      <input
        type="file"
        multiple
        style={{ display: 'none' }}
        ref={input}
        onChange={event => {
          if (event.target.files) {
            let files: File[] = []
            for (const file of (event.target.files as unknown) as File[]) {
              files = [...files, file]
            }
            props.onFiles(files)
          }
        }}
      />
    </React.Fragment>
  )
}
