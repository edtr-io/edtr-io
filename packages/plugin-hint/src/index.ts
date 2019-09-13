import { createIcon, faLightbulb } from '@edtr-io/editor-ui'
import {
  legacyChild,
  legacyObject,
  legacyString,
  StatefulPlugin
} from '@edtr-io/plugin'

import { HintEditor } from './editor'

export const hintState = legacyObject({
  title: legacyString(''),
  content: legacyChild('rows')
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
