import { StateType, StatefulPlugin } from '@edtr-io/core'

import { ScMcExerciseEditor } from './editor'
import { createIcon, faDotCircle } from '@edtr-io/editor-ui'

export const AnswerProps = StateType.object({
  id: StateType.child(),
  isCorrect: StateType.boolean(false),
  feedback: StateType.child(),
  hasFeedback: StateType.boolean(false)
})

export const scMcState = StateType.object({
  isSingleChoice: StateType.boolean(false),
  answers: StateType.list(AnswerProps)
})

export const scMcExercisePlugin: StatefulPlugin<typeof scMcState> = {
  Component: ScMcExerciseEditor,
  state: scMcState,
  icon: createIcon(faDotCircle)
}
