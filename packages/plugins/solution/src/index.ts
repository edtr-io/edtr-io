import {
  child,
  object,
  string,
  EditorPlugin,
  EditorPluginProps
} from '@edtr-io/plugin'

import { SolutionEditor } from './editor'

/** @public */
export const solutionState = object({
  title: string(''),
  content: child({ plugin: 'rows' })
})
/** @public */
export type SolutionState = typeof solutionState
/** @public */
export type SolutionProps = EditorPluginProps<SolutionState>

/** @public */
export function createSolutionPlugin(): EditorPlugin<SolutionState> {
  return {
    Component: SolutionEditor,
    config: {},
    state: solutionState
  }
}
