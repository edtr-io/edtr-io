import { createIcon, faLightbulb } from '@edtr-io/editor-ui'
import { child, object, string, StatefulPlugin } from '@edtr-io/plugin'

import { HintEditor } from './editor'

export const hintState = object({
  title: string(''),
  content: child('rows')
})

export const hintPlugin: StatefulPlugin<typeof hintState> = {
  Component: HintEditor,
  state: hintState,
  title: 'Hinweis',
  description: 'Gib zusätzliche Tipps zur Aufgabe in dieser ausklappbaren Box.',
  icon: createIcon(faLightbulb),
  getFocusableChildren(state) {
    return [state().content]
  }
}
