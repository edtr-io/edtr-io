import { StatefulPlugin, StateType } from '@edtr-io/core'
import { HintEditor } from './editor'

export const hintState = StateType.object({
  title: StateType.string(''),
  content: StateType.child()
})

export const hintPlugin: StatefulPlugin<typeof hintState> = {
  Component: HintEditor,
  state: hintState
}
