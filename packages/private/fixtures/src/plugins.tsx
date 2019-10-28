// Declaring these as devDependencies would lead to a dependency cycles. Since we only use these for testing anyways, we can safely disable the ESLint rule here
/* eslint-disable import/no-extraneous-dependencies */
import { child, list, number, object, Plugin } from '@edtr-io/plugin'
import { createAnchorPlugin } from '@edtr-io/plugin-anchor'
import { createBlockquotePlugin } from '@edtr-io/plugin-blockquote'
import { createEquationsPlugin } from '@edtr-io/plugin-equations'
import { createGeogebraPlugin } from '@edtr-io/plugin-geogebra'
import { createHighlightPlugin } from '@edtr-io/plugin-highlight'
import { createHintPlugin } from '@edtr-io/plugin-hint'
import { createImagePlugin } from '@edtr-io/plugin-image'
import { createImportantStatementPlugin } from '@edtr-io/plugin-important-statement'
import { createInputExercisePlugin } from '@edtr-io/plugin-input-exercise'
import { createRowsPlugin } from '@edtr-io/plugin-rows'
import { createScMcExercisePlugin } from '@edtr-io/plugin-sc-mc-exercise'
import { createSerloInjectionPlugin } from '@edtr-io/plugin-serlo-injection'
import { createSolutionPlugin } from '@edtr-io/plugin-solution'
import { createSpoilerPlugin } from '@edtr-io/plugin-spoiler'
import { createTablePlugin } from '@edtr-io/plugin-table'
import { createTextPlugin } from '@edtr-io/plugin-text'
import { createVideoPlugin } from '@edtr-io/plugin-video'

const registry = [
  // Must be placed before files for onPaste
  {
    name: 'image',
    ...createImagePlugin({
      upload: () => Promise.resolve('foo'),
      validate: () => {
        return { valid: true }
      }
    })
  },
  {
    name: 'anchor',
    ...createAnchorPlugin()
  },
  {
    name: 'blockquote',
    ...createBlockquotePlugin()
  },
  {
    name: 'equations',
    ...createEquationsPlugin()
  },
  {
    name: 'geogebra',
    ...createGeogebraPlugin()
  },
  {
    name: 'highlight',
    ...createHighlightPlugin()
  },
  {
    name: 'hint',
    ...createHintPlugin()
  },
  {
    name: 'inputExercise',
    ...createInputExercisePlugin()
  },
  {
    name: 'importantStatement',
    ...createImportantStatementPlugin()
  },
  {
    name: 'scMcExercise',
    ...createScMcExercisePlugin()
  },
  {
    name: 'serloInjection',
    ...createSerloInjectionPlugin()
  },
  {
    name: 'solution',
    ...createSolutionPlugin()
  },
  {
    name: 'spoiler',
    ...createSpoilerPlugin()
  },
  {
    name: 'table',
    ...createTablePlugin()
  },
  {
    name: 'video',
    ...createVideoPlugin()
  }
]

const textPlugin = createTextPlugin({
  registry
})

const nestedArrayState = object({
  children: list(child('stateful'), 1)
})

const nestedState = object({
  child: child('stateful')
})

const statefulState = number(0)

export const plugins: Record<string, Plugin<any, any>> = {
  rows: createRowsPlugin({
    plugins: [{ name: 'text', ...textPlugin }, ...registry]
  }),
  text: textPlugin,
  stateless: {
    config: {},
    Component: () => null
  },
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

registry.forEach(({ name, ...plugin }) => {
  plugins[name] = plugin
})
