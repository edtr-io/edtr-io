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
import { FileState, FileType } from './types'
import { parseFileType } from './upload'

const Download = styled.a<{ tmp?: boolean }>(props => {
  return {
    display: 'inline-block',
    textDecoration: 'none',
    color: props.tmp ? '#aaa' : 'rgb(51,51,51)',
    margin: '10px'
  }
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
  file: FileState
}> = props => {
  const { file } = props
  if (file.uploaded) {
    return (
      <Download href={file.uploaded.location} download={file.uploaded.name}>
        <File>
          <Icon icon={getIconFromType(file.uploaded.type)} size="3x" />
          <Filename>{file.uploaded.name}</Filename>
        </File>
      </Download>
    )
  }
  if (file.loaded) {
    return (
      <Download href={file.loaded.dataUrl} download={file.loaded.file.name} tmp>
        <File>
          <Icon
            icon={getIconFromType(parseFileType(file.loaded.file.name))}
            size="3x"
          />
          <Filename>{file.loaded.file.name}</Filename>
        </File>
      </Download>
    )
  }
  return null
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
          <FileRenderer file={file.value} key={file.value.uploaded.name + i} />
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
    //FileType.Other
    default:
      return faFileDownload
  }
}
