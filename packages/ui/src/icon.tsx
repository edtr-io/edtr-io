import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { IconDefinition } from '@fortawesome/fontawesome-svg-core'

export const Icon = FontAwesomeIcon

export {
  faBold,
  faCaretSquareDown,
  faCaretSquareUp,
  faCheck,
  faCut,
  faCog,
  faCopy,
  faFileAlt,
  faFileArchive,
  faFileAudio,
  faFileDownload,
  faFileExcel,
  faFileImage,
  faFilePdf,
  faFilePowerpoint,
  faFileVideo,
  faFileWord,
  faFilm,
  faImages,
  faItalic,
  faLink,
  faUnlink,
  faMinus,
  faPaste,
  faPencilAlt,
  faPlus,
  faSpinner,
  faTimes,
  faTrashAlt,
} from '@fortawesome/free-solid-svg-icons'

export function createIcon(i: IconDefinition): React.FunctionComponent {
  const I = () => <Icon icon={i} size="5x" />
  return I
}