import { SpoilerEditor } from './editor'
import { StatefulPlugin, StateType } from '@edtr-io/core'

export const spoilerState = StateType.object({
  title: StateType.string(''),
  content: StateType.child()
})

export const spoilerPlugin: StatefulPlugin<typeof spoilerState> = {
  Component: SpoilerEditor,
  state: spoilerState
}
