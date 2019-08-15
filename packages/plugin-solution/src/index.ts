import { StatefulPlugin, StateType } from '@edtr-io/core'
import { createIcon, faCheckSquare } from '@edtr-io/editor-ui'

import { SolutionEditor } from './editor'

export const solutionState = StateType.object({
  title: StateType.string(''),
  content: StateType.child('rows')
})

export const solutionPlugin: StatefulPlugin<typeof solutionState> = {
  Component: SolutionEditor,
  state: solutionState,
  icon: createIcon(faCheckSquare),
  title: 'Lösung',
  description:
    'Gestalte in dieser ausklappbaren Box eine ausführliche Lösung zu deinen Aufgaben.',
  getFocusableChildren(state) {
    return [state().content]
  }
}
