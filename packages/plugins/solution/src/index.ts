import {
  child,
  object,
  string,
  EditorPlugin,
  EditorPluginProps
} from '@edtr-io/plugin'
import { name as solutionStepsPlugin } from '@edtr-io/plugin-solution-steps/__fixtures__'

import { SolutionEditor } from './editor'

const solutionState = object({
  title: string(''),
  content: child({ plugin: solutionStepsPlugin })
})

export type SolutionState = typeof solutionState
export type SolutionProps = EditorPluginProps<SolutionState>

export function createSolutionPlugin(): EditorPlugin<SolutionState> {
  return {
    Component: SolutionEditor,
    config: {},
    state: solutionState
  }
}
