// Declaring these as devDependencies would lead to a dependency cycles. Since we only use these for testing anyways, we can safely disable the ESLint rule here
/* eslint-disable import/no-extraneous-dependencies */
import { child, EditorPlugin, list, number, object } from '@edtr-io/plugin'
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
import { createSerloInjectionPlugin } from '@edtr-io/plugin-serlo-injection'
import { createSolutionPlugin } from '@edtr-io/plugin-solution'
import { createSpoilerPlugin } from '@edtr-io/plugin-spoiler'
import { createTablePlugin } from '@edtr-io/plugin-table'
import { createTextPlugin } from '@edtr-io/plugin-text'
import { createVideoPlugin } from '@edtr-io/plugin-video'
import { createEquationsPlugin } from '@edtr-io/plugin-equations'
import { createFilesPlugin, FileType } from '@edtr-io/plugin-files'

const nestedArrayState = object({
  children: list(child({ plugin: 'stateful' }), 1)
})

const nestedState = object({
  child: child({ plugin: 'stateful' })
})

const statefulState = number(0)

const filesPlugin = createFilesPlugin({
  upload: () =>
    Promise.resolve({ type: FileType.Image, name: 'foo', location: 'bar' })
})
const imagePlugin = createImagePlugin({
  upload: () => Promise.resolve('foo'),
  validate: () => {
    return { valid: true }
  }
})
export const plugins: Record<
  string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  EditorPlugin<any, any>
> = {
  anchor: createAnchorPlugin(),
  blockquote: createBlockquotePlugin(),
  equations: createEquationsPlugin(),
  files: filesPlugin,
  geogebra: createGeogebraPlugin(),
  highlight: createHighlightPlugin(),
  hint: createHintPlugin(),
  image: imagePlugin,
  importantStatement: createImportantStatementPlugin(),
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
  serloInjection: createSerloInjectionPlugin(),
  solution: createSolutionPlugin(),
  spoiler: createSpoilerPlugin(),
  table: createTablePlugin(),
  text: createTextPlugin({ registry: [] }),
  video: createVideoPlugin(),

  stateful: {
    config: {},
    Component: () => null,
    state: statefulState
  },
  nested: {
    config: {},
    Component: () => null,
    state: nestedState
  },
  nestedArray: {
    config: {},
    Component: () => null,
    state: nestedArrayState
  }
}
