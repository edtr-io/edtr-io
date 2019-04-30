import { StatefulPlugin, StateType } from '@edtr-io/core'

import { SpoilerEditor } from './editor'
import { createIcon, faCaretSquareDown } from '@edtr-io/editor-ui'

export const spoilerState = StateType.object({
  title: StateType.string(''),
  content: StateType.child()
})

export const spoilerPlugin: StatefulPlugin<typeof spoilerState> = {
  Component: SpoilerEditor,
  state: spoilerState,
  icon: createIcon(faCaretSquareDown),
  title: 'Spoiler',
  description:
    'In diese ausklappbaren Box kannst du zum Beispiel Exkurse hinzufügen.'
}

export interface SpoilerTheme {
  color: string
}
