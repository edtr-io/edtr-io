import { StatefulPluginEditorProps } from '@edtr-io/core'
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
  Icon,
  styled
} from '@edtr-io/renderer-ui'
import * as React from 'react'

import { fileState } from '.'
import { FileType } from '@edtr-io/editor-ui'

const Download = styled.a({
  display: 'inline-block',
  textDecoration: 'none',
  color: '#aaa',
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

export function FileRenderer(
  props: StatefulPluginEditorProps<typeof fileState>
) {
  return (
    <React.Fragment>
      {props.state.value.uploaded.map(file => (
        <Download href={file.location} download={file.name} key={file.name}>
          <File>
            <Icon icon={getIconFromType(file.type)} size="3x" />
            <Filename>{file.name}</Filename>
          </File>
        </Download>
      ))}
    </React.Fragment>
  )
}

function getIconFromType(type: FileType | undefined) {
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
    //FileType.Other
    default:
      return faFileDownload
  }
}
