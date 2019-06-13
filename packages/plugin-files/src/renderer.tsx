import { StatefulPluginEditorProps, StateType } from '@edtr-io/core'
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

  const filename =
    file.name.length > 15 ? `${file.name.substr(0, 12)}...` : file.name
  return (
    <Download href={file.location} download={file.name}>
      <File title={file.name}>
        <Icon icon={getIconFromType(file.type)} size="3x" />
        <Filename>{filename}</Filename>
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
        if (StateType.isTempFile(file.value)) {
          return null
        }
        return <FileRenderer file={file.value} key={file.value.name + i} />
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
