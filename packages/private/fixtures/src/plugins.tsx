// Declaring these as devDependencies would lead to a dependency cycles. Since we only use these for testing anyways, we can safely disable the ESLint rule here
/* eslint-disable import/no-extraneous-dependencies */
import { child, list, number, object } from '@edtr-io/plugin'
import { createAnchorPlugin } from '@edtr-io/plugin-anchor'
import { createBlockquotePlugin } from '@edtr-io/plugin-blockquote'
import { createGeogebraPlugin } from '@edtr-io/plugin-geogebra'
import { highlightPlugin } from '@edtr-io/plugin-highlight'
import { hintPlugin } from '@edtr-io/plugin-hint'
import { createImagePlugin } from '@edtr-io/plugin-image'
import { importantStatementPlugin } from '@edtr-io/plugin-important-statement'
import { inputExercisePlugin } from '@edtr-io/plugin-input-exercise'
import { createMultimediaExplanationPlugin } from '@edtr-io/plugin-multimedia-explanation'
import { rowsPlugin } from '@edtr-io/plugin-rows'
import { scMcExercisePlugin } from '@edtr-io/plugin-sc-mc-exercise'
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
export const plugins = {
  anchor: createAnchorPlugin(),
  blockquote: createBlockquotePlugin(),
  geogebra: createGeogebraPlugin(),
  highlight: highlightPlugin,
  hint: hintPlugin,
  image: imagePlugin,
  important: importantStatementPlugin,
  injection: serloInjectionPlugin,
  inputExercise: inputExercisePlugin,
  multimediaExplanation: createMultimediaExplanationPlugin([
    {
      ...imagePlugin,
      name: 'image'
    },
    {
      ...videoPlugin,
      name: 'video'
    },
    {
      name: 'geogebra'
    }
  ]),
  rows: rowsPlugin,
  scMcExercise: scMcExercisePlugin,
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
