import { StatefulPlugin, StateType } from '@edtr-io/core'

import { SpoilerEditor } from './editor'

export const spoilerState = StateType.object({
  title: StateType.string(''),
  content: StateType.child('rows')
})

export const spoilerPlugin: StatefulPlugin<typeof spoilerState> = {
  Component: SpoilerEditor,
  state: spoilerState
}

export interface SpoilerTheme {
  color: string
}
