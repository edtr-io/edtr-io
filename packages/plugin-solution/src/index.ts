import { StatefulPlugin, StateType } from '@edtr-io/core'

import { SolutionEditor } from './editor'

export const solutionState = StateType.object({
  title: StateType.string(''),
  content: StateType.child('rows')
})

export const solutionPlugin: StatefulPlugin<typeof solutionState> = {
  Component: SolutionEditor,
  state: solutionState
}
