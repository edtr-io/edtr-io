import {
  createIcon,
  faAnchor,
  faCaretSquareDown,
  faCode,
  faCubes,
  faDotCircle,
  faFileAlt,
  faFilm,
  faImages,
  faKeyboard,
  faNewspaper,
  faParagraph,
  faPhotoVideo,
  faQuoteRight,
} from '@edtr-io/ui'
import * as React from 'react'

export const defaultRegistryPlugins = [
  {
    name: 'anchor',
    title: 'Anchor',
    icon: createIcon(faAnchor),
  },
  {
    name: 'blockquote',
    title: 'Blockquote',
    icon: createIcon(faQuoteRight),
  },
  {
    name: 'files',
    title: 'Files',
    icon: createIcon(faFileAlt),
  },
  {
    name: 'geogebra',
    title: 'GeoGebra',
    icon: createIcon(faCubes),
  },
  {
    name: 'highlight',
    title: 'Code Highlight',
    icon: createIcon(faCode),
  },
  {
    name: 'image',
    title: 'Image',
    icon: createIcon(faImages),
  },
  {
    name: 'inputExercise',
    title: 'Input Exercise',
    icon: createIcon(faKeyboard),
  },
  {
    name: 'multimediaExplanation',
    title: 'Multimedia Explanation',
    icon: createIcon(faPhotoVideo),
  },
  {
    name: 'scMcExercise',
    title: 'Choice Exercise',
    icon: createIcon(faDotCircle),
  },
  {
    name: 'serloInjection',
    title: 'Serlo Content',
    icon: createIcon(faNewspaper),
  },
  {
    name: 'spoiler',
    title: 'Spoiler',
    icon: createIcon(faCaretSquareDown),
  },
  {
    name: 'table',
    title: 'Markdown Table',
  },
  {
    name: 'text',
    title: 'Text',
    icon: createIcon(faParagraph),
  },
  {
    name: 'video',
    title: 'Video',
    icon: createIcon(faFilm),
  },
]

/** @internal */
export const RegistryContext = React.createContext<Registry>(
  defaultRegistryPlugins
)

/** @internal */
export type Registry = {
  name: string
  title?: string
  icon?: React.ComponentType
  description?: string
}[]
