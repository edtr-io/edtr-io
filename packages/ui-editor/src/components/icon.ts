import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import styled from 'styled-components'
import '../assets/icon-font.css'

export const Icon = FontAwesomeIcon

export {
  faCheck,
  faCut,
  faCog,
  faCopy,
  faImages,
  faLink,
  faMinus,
  faPaste,
  faPencilAlt,
  faPlus,
  faSpinner,
  faTimes,
  faTrashAlt,
  faFilm,
  faCaretSquareUp,
  faCaretSquareDown,
  faSortUp,
  faSortDown,
  faToolbox,
  faEllipsisH,
  faSearch,
  faCloudUploadAlt,
  faQuestionCircle
} from '@fortawesome/free-solid-svg-icons'

export type EdtrIconDefinition = string
export const EdtrIcon = styled.i<{ icon: EdtrIconDefinition }>(props => {
  return {
    '&::before': {
      content: `"${props.icon}"`
    },
    fontFamily: 'edtr-io-icons !important',
    speak: 'none',
    fontStyle: 'normal',
    fontWeight: 'normal',
    fontVariant: 'normal',
    textTransform: 'none',
    lineHeight: 1,
    verticalAlign: 'middle',
    fontSize: '25px',

    /* Better Font Rendering =========== */
    '-webkit-font-smoothing': 'antialiased',
    '-moz-osx-font-smoothing': 'grayscale'
  }
})

export const edtrIconSet = {
  formel: '\\e900',
  close: '\\e901',
  alignCenter: '\\e902',
  alignBlock: '\\e903',
  alignLeft: '\\e904',
  alignRight: '\\e905',
  bold: '\\e906',
  fill: '\\e907',
  color: '\\e908',
  colorText: '\\e910',
  italic: '\\e909',
  listBullets: '\\e90a',
  listNumbered: '\\e90b',
  quote: '\\e90c',
  functions: '\\e90d',
  link: '\\e90e',
  text: '\\e90f'
}
