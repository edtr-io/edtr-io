import { createIcon, faCaretSquareDown } from '@edtr-io/editor-ui'
import { legacyChild, legacyObject, legacyString, StatefulPlugin } from '@edtr-io/plugin'

import { SpoilerEditor } from './editor'

export const spoilerState = legacyObject({
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
