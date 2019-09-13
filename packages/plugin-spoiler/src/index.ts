import { createIcon, faCaretSquareDown } from '@edtr-io/editor-ui'
import { legacyChild, object, legacyString, StatefulPlugin } from '@edtr-io/plugin'

import { SpoilerEditor } from './editor'

export const spoilerState = object({
  title: legacyString(''),
  content: legacyChild('rows')
})

export const spoilerPlugin: StatefulPlugin<typeof spoilerState> = {
  Component: SpoilerEditor,
  state: spoilerState,
  icon: createIcon(faCaretSquareDown),
  title: 'Spoiler',
  description:
    'In diese ausklappbaren Box kannst du zum Beispiel Exkurse hinzufügen.',
  getFocusableChildren(state) {
    return [state().content]
  }
}

export interface SpoilerTheme {
  color: string
}
