import { EquationsEditor } from './editor'
import { StateType, StatefulPlugin } from '@edtr-io/core'

export const StepProps = StateType.object({
  left: StateType.child(),
  right: StateType.child(),
  transform: StateType.child()
})

export const equationsState = StateType.object({
  steps: StateType.list(StepProps)
})

export const equationsPlugin: StatefulPlugin<typeof equationsState> = {
  Component: EquationsEditor,
  state: equationsState
}

export * from './editor'
