// Declaring these as devDependencies would lead to cycles. Since we only use these for testing anyways, we can safely disable the ESLint rule here
/* eslint-disable import/no-extraneous-dependencies */
import { anchorPlugin } from '@edtr-io/plugin-anchor'
import { blockquotePlugin } from '@edtr-io/plugin-blockquote'
import { geogebraPlugin } from '@edtr-io/plugin-geogebra'
import { highlightPlugin } from '@edtr-io/plugin-highlight'
import { hintPlugin } from '@edtr-io/plugin-hint'
import { createImagePlugin } from '@edtr-io/plugin-image'
import { importantStatementPlugin } from '@edtr-io/plugin-important-statement'
import { inputExercisePlugin } from '@edtr-io/plugin-input-exercise'
import { rowsPlugin } from '@edtr-io/plugin-rows'
import { scMcExercisePlugin } from '@edtr-io/plugin-sc-mc-exercise'
import { serloInjectionPlugin } from '@edtr-io/plugin-serlo-injection'
import { solutionPlugin } from '@edtr-io/plugin-solution'
import { spoilerPlugin } from '@edtr-io/plugin-spoiler'
import { tablePlugin } from '@edtr-io/plugin-table'
import { textPlugin } from '@edtr-io/plugin-text'
import { videoPlugin } from '@edtr-io/plugin-video'

import { StateType } from '../src'
import { StateDescriptorReturnType } from '../src/plugin-state'

const nestedArrayState = StateType.object({
  children: StateType.list(StateType.child('stateful'), 1)
})

const nestedState = StateType.object({
  child: StateType.child('stateful')
})

const statefulState = StateType.number(0)

export const plugins = {
  anchor: anchorPlugin,
  blockquote: blockquotePlugin,
  geogebra: geogebraPlugin,
  highlight: highlightPlugin,
  hint: hintPlugin,
  image: createImagePlugin({
    upload: () => Promise.resolve('foo'),
    validate: () => {
      return { valid: true }
    }
  }),
  important: importantStatementPlugin,
  injection: serloInjectionPlugin,
  inputExercise: inputExercisePlugin,
  rows: rowsPlugin,
  scMcExercise: scMcExercisePlugin,
  solution: solutionPlugin,
  spoiler: spoilerPlugin,
  table: tablePlugin,
  text: textPlugin,
  video: videoPlugin,

  stateless: {
    Component: () => null
  },
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
    state: nestedArrayState,
    getFocusableChildren: (
      state: StateDescriptorReturnType<typeof nestedArrayState>
    ) => {
      return state.children()
    }
  }
}
