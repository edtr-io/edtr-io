import { StateTypeSerializedType } from '@edtr-io/plugin'
import {
  createIcon,
  faAnchor,
  faCaretSquareDown,
  faCheckSquare,
  faCode,
  faCubes,
  faDotCircle,
  faEquals,
  faFileAlt,
  faFilm,
  faImages,
  faKeyboard,
  faLightbulb,
  faNewspaper,
  faParagraph,
  faPhotoVideo,
  faQuoteRight
} from '@edtr-io/ui'
import {
  name as textPlugin,
  createTextState,
  Text
} from '@edtr-io/plugin-text/__fixtures__'

import { RowsState, createRowsPlugin } from '../src'

export const name = 'rows'
export const plugin = createRowsPlugin({
  plugins: [
    {
      name: 'anchor',
      title: 'Anchor',
      icon: createIcon(faAnchor)
    },
    {
      name: 'blockquote',
      title: 'Blockquote',
      icon: createIcon(faQuoteRight)
    },
    {
      name: 'equations',
      title: 'Equations',
      icon: createIcon(faEquals)
    },
    {
      name: 'files',
      title: 'Files',
      icon: createIcon(faFileAlt)
    },
    {
      name: 'geogebra',
      title: 'GeoGebra',
      icon: createIcon(faCubes)
    },
    {
      name: 'highlight',
      title: 'Code Highlight',
      icon: createIcon(faCode)
    },
    {
      name: 'hint',
      title: 'Hint',
      icon: createIcon(faLightbulb)
    },
    {
      name: 'image',
      title: 'Image',
      icon: createIcon(faImages)
    },
    {
      name: 'importantStatement',
      title: 'Important Statement'
    },
    {
      name: 'inputExercise',
      title: 'Input Exercise',
      icon: createIcon(faKeyboard)
    },
    {
      name: 'multimediaExplanation',
      title: 'Multimedia Explanation',
      icon: createIcon(faPhotoVideo)
    },
    {
      name: 'scMcExercise',
      title: 'Choice Exercise',
      icon: createIcon(faDotCircle)
    },
    {
      name: 'serloInjection',
      title: 'Serlo Content',
      icon: createIcon(faNewspaper)
    },
    {
      name: 'solution',
      title: 'Solution',
      icon: createIcon(faCheckSquare)
    },
    {
      name: 'spoiler',
      title: 'Spoiler',
      icon: createIcon(faCaretSquareDown)
    },
    {
      name: 'table',
      title: 'Markdown Table'
    },
    {
      name: 'text',
      title: 'Text',
      icon: createIcon(faParagraph)
    },
    {
      name: 'video',
      title: 'Video',
      icon: createIcon(faFilm)
    }
  ]
})

export const states: Record<string, StateTypeSerializedType<RowsState>> = {
  simple: createRowsState({
    plugin: textPlugin,
    state: createTextState(Text.create({ text: 'Hello world' }))
  })
}

export function createRowsState(
  ...args: { plugin: string; state: unknown }[]
): StateTypeSerializedType<RowsState> {
  return args
}
