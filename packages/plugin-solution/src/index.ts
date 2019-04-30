import { StatefulPlugin, StateType } from '@edtr-io/core'

import { SolutionEditor } from './editor'
import { createIcon, faCheckSquare } from '@edtr-io/editor-ui'

export const solutionState = StateType.object({
  title: StateType.string(''),
  content: StateType.child()
})

export const solutionPlugin: StatefulPlugin<typeof solutionState> = {
  Component: SolutionEditor,
  state: solutionState,
  icon: createIcon(faCheckSquare),
  title: 'Lösung',
  description:
    'Gestalte in dieser ausklappbaren Box eine ausführliche Lösung zu deinen Aufgaben.'
}
