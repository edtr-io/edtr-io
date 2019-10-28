import { child, object, StatefulPlugin, string } from '@edtr-io/plugin'
import { createIcon, faLightbulb } from '@edtr-io/ui'

import { HintEditor } from './editor'

export const hintState = object({
  title: string(''),
  content: child('rows')
})

export function createHintPlugin(): StatefulPlugin<typeof hintState> {
  return {
    Component: HintEditor,
    config: {},
    state: hintState,
    title: 'Hinweis',
    description:
      'Gib zusätzliche Tipps zur Aufgabe in dieser ausklappbaren Box.',
    icon: createIcon(faLightbulb)
  }
}
