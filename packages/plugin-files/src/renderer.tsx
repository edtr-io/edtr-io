import { StatefulPluginEditorProps } from '@edtr-io/core'
import { styled } from '@edtr-io/ui'
import {
  faFileArchive,
  faFileAudio,
  faFileDownload,
  faFileExcel,
  faFileImage,
  faFilePdf,
  faFilePowerpoint,
  faFileVideo,
  faFileWord,
  Icon
} from '@edtr-io/renderer-ui'
import * as React from 'react'

import { fileState } from '.'
import { FileType, UploadedFile } from './types'

const Download = styled.a<{ tmp?: boolean; failed?: boolean }>({
  display: 'inline-block',
  textDecoration: 'none',
  color: 'inherit',
  margin: '10px'
})
const File = styled.div({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center'
})

const Filename = styled.span({
  color: 'rgb(51,51,51)'
})

export const FileRenderer: React.FunctionComponent<{
  file: UploadedFile
}> = props => {
  const { file } = props

  return (
    <Download href={file.location} download={file.name}>
      <File>
        <Icon icon={getIconFromType(file.type)} size="3x" />
        <Filename>{file.name}</Filename>
      </File>
    </Download>
  )
}

export function FilesRenderer(
  props: StatefulPluginEditorProps<typeof fileState>
) {
  return (
    <React.Fragment>
      {props.state.items.map((file, i) => {
        if (!file.value.uploaded) {
          return null
        }
        return (
          <FileRenderer
            file={file.value.uploaded}
            key={file.value.uploaded.name + i}
          />
        )
      })}
    </React.Fragment>
  )
}

function getIconFromType(type: FileType) {
  switch (type) {
    case FileType.Archive:
      return faFileArchive
    case FileType.Audio:
      return faFileAudio
    case FileType.Excel:
      return faFileExcel
    case FileType.Image:
      return faFileImage
    case FileType.PDF:
      return faFilePdf
    case FileType.PowerPoint:
      return faFilePowerpoint
    case FileType.Video:
      return faFileVideo
    case FileType.Word:
      return faFileWord
    case FileType.Other:
      return faFileDownload
  }
}
