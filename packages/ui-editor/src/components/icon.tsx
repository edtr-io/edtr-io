import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { IconDefinition } from '@fortawesome/fontawesome-svg-core'
import * as React from 'react'
export const Icon = FontAwesomeIcon

export {
  faBold,
  faCheck,
  faCut,
  faCog,
  faCopy,
  faFileAlt,
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
  faFilm,
  faCaretSquareUp,
  faCaretSquareDown,
  faSortUp,
  faSortDown,
  faToolbox,
  faEllipsisH,
  faSearch,
  faCloudUploadAlt,
  faQuestionCircle,
  faListUl,
  faListOl,
  faQuoteLeft,
  faAnchor,
  faQuoteRight,
  faEquals,
  faCubes,
  faCode,
  faLightbulb,
  faKeyboard,
  faDotCircle,
  faCheckSquare,
  faParagraph
} from '@fortawesome/free-solid-svg-icons'

export function createIcon(i: IconDefinition): React.FunctionComponent {
  const I = () => <Icon icon={i} size="5x" />
  return I
}
