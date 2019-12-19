import { child, object, Plugin, string } from '@edtr-io/plugin'
import { createIcon, faLightbulb } from '@edtr-io/ui'

import { HintEditor } from './editor'

export const hintState = object({
  title: string(''),
  content: child('rows')
})

export const hintPlugin: Plugin<typeof hintState> = {
  Component: HintEditor,
  state: hintState,
  title: 'Hinweis',
  description: 'Gib zusätzliche Tipps zur Aufgabe in dieser ausklappbaren Box.',
  icon: createIcon(faLightbulb)
}
