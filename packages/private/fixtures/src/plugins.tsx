// Declaring these as devDependencies would lead to a dependency cycles. Since we only use these for testing anyways, we can safely disable the ESLint rule here
/* eslint-disable import/no-extraneous-dependencies */
import {
  child,
  DeprecatedPlugin,
  EditorPlugin,
  list,
  number,
  object
} from '@edtr-io/plugin'
import { createAnchorPlugin } from '@edtr-io/plugin-anchor'
import { createBlockquotePlugin } from '@edtr-io/plugin-blockquote'
import { createGeogebraPlugin } from '@edtr-io/plugin-geogebra'
import { createHighlightPlugin } from '@edtr-io/plugin-highlight'
import { createHintPlugin } from '@edtr-io/plugin-hint'
import { createImagePlugin } from '@edtr-io/plugin-image'
import { createImportantStatementPlugin } from '@edtr-io/plugin-important-statement'
import { createInputExercisePlugin } from '@edtr-io/plugin-input-exercise'
import { createMultimediaExplanationPlugin } from '@edtr-io/plugin-multimedia-explanation'
import { createRowsPlugin } from '@edtr-io/plugin-rows'
import { createScMcExercisePlugin } from '@edtr-io/plugin-sc-mc-exercise'
import { serloInjectionPlugin } from '@edtr-io/plugin-serlo-injection'
import { solutionPlugin } from '@edtr-io/plugin-solution'
import { spoilerPlugin } from '@edtr-io/plugin-spoiler'
import { tablePlugin } from '@edtr-io/plugin-table'
import { textPlugin } from '@edtr-io/plugin-text'
import { videoPlugin } from '@edtr-io/plugin-video'

const nestedArrayState = object({
  children: list(child({ plugin: 'stateful' }), 1)
})

const nestedState = object({
  child: child({ plugin: 'stateful' })
})

const statefulState = number(0)

const imagePlugin = createImagePlugin({
  upload: () => Promise.resolve('foo'),
  validate: () => {
    return { valid: true }
  }
})
export const plugins: Record<
  string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  DeprecatedPlugin | EditorPlugin<any, any>
> = {
  anchor: createAnchorPlugin(),
  blockquote: createBlockquotePlugin(),
  geogebra: createGeogebraPlugin(),
  highlight: createHighlightPlugin(),
  hint: createHintPlugin(),
  image: imagePlugin,
  importantStatement: createImportantStatementPlugin(),
  injection: serloInjectionPlugin,
  inputExercise: createInputExercisePlugin(),
  multimediaExplanation: createMultimediaExplanationPlugin({
    plugins: [
      {
        name: 'image',
        title: 'Image'
      },
      {
        name: 'video',
        title: 'Video'
      },
      {
        name: 'geogebra',
        title: 'GeoGebra'
      }
    ]
  }),
  rows: createRowsPlugin({ plugins: [] }),
  scMcExercise: createScMcExercisePlugin(),
  solution: solutionPlugin,
  spoiler: spoilerPlugin,
  table: tablePlugin,
  text: textPlugin,
  video: videoPlugin,

  stateful: {
    Component: () => null,
    state: statefulState
  },
  nested: {
    Component: () => null,
    state: nestedState
  },
  nestedArray: {
    Component: () => null,
    state: nestedArrayState
  }
}
