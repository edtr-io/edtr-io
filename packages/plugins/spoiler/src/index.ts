import { child, object, DeprecatedPlugin, string } from '@edtr-io/plugin'
import { createIcon, faCaretSquareDown } from '@edtr-io/ui'

import { SpoilerEditor } from './editor'

export const spoilerState = object({
  title: string(''),
  content: child({ plugin: 'rows' })
})

export const spoilerPlugin: DeprecatedPlugin<typeof spoilerState> = {
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
