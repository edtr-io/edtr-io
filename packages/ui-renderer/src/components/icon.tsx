import { FontAwesomeIcon, Props } from '@fortawesome/react-fontawesome'
import * as R from 'ramda'
import * as React from 'react'

export function Icon(props: Props) {
  const allowedProps = R.pick(
    [
      'icon',
      'mask',
      'className',
      'color',
      'spin',
      'pulse',
      'border',
      'fixedWidth',
      'inverse',
      'listItem',
      'flip',
      'size',
      'pull',
      'rotation',
      'transform',
      'symbol',
      'style',
      'tabIndex',
      'title'
    ],
    props
  )
  return <FontAwesomeIcon {...allowedProps} />
}

export {
  faCaretSquareDown,
  faCaretSquareUp,
  faFileDownload,
  faFileAlt,
  faFileArchive,
  faFileAudio,
  faFileExcel,
  faFileImage,
  faFilePdf,
  faFileWord,
  faFileVideo,
  faFilePowerpoint,
  faSortDown,
  faSortUp
} from '@fortawesome/free-solid-svg-icons'
