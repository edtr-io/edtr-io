import { StatefulPlugin, StateType } from '@edtr-io/core'

import { HintEditor } from './editor'

export const hintState = StateType.object({
  title: StateType.string(''),
  content: StateType.child('rows')
})

export const hintPlugin: StatefulPlugin<typeof hintState> = {
  Component: HintEditor,
  state: hintState
}
