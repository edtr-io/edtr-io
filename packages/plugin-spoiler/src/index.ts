import { StatefulPlugin, StateType } from '@edtr-io/core'
import { createIcon, faCaretSquareDown } from '@edtr-io/editor-ui'

import { SpoilerEditor } from './editor'

export const spoilerState = StateType.object({
  title: StateType.string(''),
  content: StateType.child('rows')
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
