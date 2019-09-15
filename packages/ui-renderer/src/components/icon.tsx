/**
 * @module @edtr-io/renderer-ui
 */
/** Comment needed because of https://github.com/christopherthielen/typedoc-plugin-external-module-name/issues/337 */
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
  faCaretSquareDown
} from '@fortawesome/free-solid-svg-icons/faCaretSquareDown'
export {
  faCaretSquareUp
} from '@fortawesome/free-solid-svg-icons/faCaretSquareUp'
export {
  faFileDownload
} from '@fortawesome/free-solid-svg-icons/faFileDownload'
export { faFileAlt } from '@fortawesome/free-solid-svg-icons/faFileAlt'
export { faFileArchive } from '@fortawesome/free-solid-svg-icons/faFileArchive'
export { faFileAudio } from '@fortawesome/free-solid-svg-icons/faFileAudio'
export { faFileExcel } from '@fortawesome/free-solid-svg-icons/faFileExcel'
export { faFileImage } from '@fortawesome/free-solid-svg-icons/faFileImage'
export { faFilePdf } from '@fortawesome/free-solid-svg-icons/faFilePdf'
export { faFileWord } from '@fortawesome/free-solid-svg-icons/faFileWord'
export { faFileVideo } from '@fortawesome/free-solid-svg-icons/faFileVideo'
export {
  faFilePowerpoint
} from '@fortawesome/free-solid-svg-icons/faFilePowerpoint'
export { faSortDown } from '@fortawesome/free-solid-svg-icons/faSortDown'
export { faSortUp } from '@fortawesome/free-solid-svg-icons/faSortUp'
