import { StateType, StatefulPlugin } from '@edtr-io/core'
import { StepByStepEditor } from './editor'

export const StepProps = StateType.object({
  type: StateType.string('step'),
  content: StateType.child(),
  explanation: StateType.child(),
  hasExplanation: StateType.boolean(true)
})

export const ContentProps = StateType.object({
  type: StateType.string('content'),
  content: StateType.child()
})

export const stepByStepState = StateType.object({
  steps: StateType.list(StepProps)
})

export const stepByStepPlugin: StatefulPlugin<typeof stepByStepState> = {
  Component: StepByStepEditor,
  state: stepByStepState
}
