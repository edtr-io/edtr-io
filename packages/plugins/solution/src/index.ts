import { child, object, StatefulPlugin, string } from '@edtr-io/plugin'
import { createIcon, faCheckSquare } from '@edtr-io/ui'

import { SolutionEditor } from './editor'

export const solutionState = object({
  title: string(''),
  content: child('rows')
})

export function createSolutionPlugin(): StatefulPlugin<typeof solutionState> {
  return {
    Component: SolutionEditor,
    config: {},
    state: solutionState,
    icon: createIcon(faCheckSquare),
    title: 'Lösung',
    description:
      'Gestalte in dieser ausklappbaren Box eine ausführliche Lösung zu deinen Aufgaben.'
  }
}
