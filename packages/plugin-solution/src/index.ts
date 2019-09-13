import { createIcon, faCheckSquare } from '@edtr-io/editor-ui'
import { legacyChild, object, legacyString, StatefulPlugin } from '@edtr-io/plugin'

import { SolutionEditor } from './editor'

export const solutionState = object({
  title: legacyString(''),
  content: legacyChild('rows')
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
