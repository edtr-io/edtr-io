import { createIcon, faCheckSquare } from '@edtr-io/editor-ui'
import { child, object, string, StatefulPlugin } from '@edtr-io/plugin'

import { SolutionEditor } from './editor'

export const solutionState = object({
  title: string(''),
  content: child('rows')
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
