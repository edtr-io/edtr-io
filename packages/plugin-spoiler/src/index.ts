import { createIcon, faCaretSquareDown } from '@edtr-io/editor-ui'
import { child, object, StatefulPlugin, string } from '@edtr-io/plugin'

import { SpoilerEditor } from './editor'

export const spoilerState = object({
  title: string(''),
  content: child('rows')
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
