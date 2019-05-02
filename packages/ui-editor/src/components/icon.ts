import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import styled, { createGlobalStyle } from 'styled-components'
// @ts-ignore
import edtrIoFontEOT from '../assets/edtr-io-icons.eot'
// @ts-ignore
import edtrIoFontTTF from '../assets/edtr-io-icons.ttf'
// @ts-ignore
import edtrIoFontWOFF from '../assets/edtr-io-icons.woff'
// @ts-ignore
import edtrIoFontSVG from '../assets/edtr-io-icons.svg'
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

export const GlobalStyle = createGlobalStyle`
  @font-face {
  font-family: 'edtr-io-icons';
  src:  url('${edtrIoFontEOT}?h3ysfi');
  src:  url('${edtrIoFontEOT}?h3ysfi#iefix') format('embedded-opentype'),
    url('${edtrIoFontTTF}?h3ysfi') format('truetype'),
    url('${edtrIoFontWOFF}?h3ysfi') format('woff'),
    url('${edtrIoFontSVG}?h3ysfi#edtr-io-icons') format('svg');
  font-weight: normal;
  font-style: normal;
}
`
