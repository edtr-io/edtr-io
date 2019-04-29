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
  icon: createIcon(faCaretSquareDown)
}

export interface SpoilerTheme {
  color: string
}
