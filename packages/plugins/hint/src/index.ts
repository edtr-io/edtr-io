import { child, object, DeprecatedPlugin, string } from '@edtr-io/plugin'
import { createIcon, faLightbulb } from '@edtr-io/ui'

import { HintEditor } from './editor'

export const hintState = object({
  title: string(''),
  content: child({ plugin: 'rows' })
})

export const hintPlugin: DeprecatedPlugin<typeof hintState> = {
  Component: HintEditor,
  state: hintState,
  title: 'Hinweis',
  description: 'Gib zusätzliche Tipps zur Aufgabe in dieser ausklappbaren Box.',
  icon: createIcon(faLightbulb)
}
