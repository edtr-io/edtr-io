import { StatefulPlugin, StateType } from '@edtr-io/core'

import { HintEditor } from './editor'
import { createIcon, faLightbulb } from '@edtr-io/editor-ui'

export const hintState = StateType.object({
  title: StateType.string(''),
  content: StateType.child('rows')
})

export const hintPlugin: StatefulPlugin<typeof hintState> = {
  Component: HintEditor,
  state: hintState,
  title: 'Hinweis',
  description: 'Gib zusätzliche Tipps zur Aufgabe in dieser ausklappbaren Box.',
  icon: createIcon(faLightbulb)
}
