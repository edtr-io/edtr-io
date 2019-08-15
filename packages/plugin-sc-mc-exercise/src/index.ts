import { StateType, StatefulPlugin } from '@edtr-io/core'
import { createIcon, faDotCircle } from '@edtr-io/editor-ui'

import { ScMcExerciseEditor } from './editor'

export const AnswerProps = StateType.object({
  id: StateType.child(),
  isCorrect: StateType.boolean(false),
  feedback: StateType.child(),
  hasFeedback: StateType.boolean(false)
})

export const scMcExerciseState = StateType.object({
  isSingleChoice: StateType.boolean(false),
  answers: StateType.list(AnswerProps)
})

export const scMcExercisePlugin: StatefulPlugin<typeof scMcExerciseState> = {
  Component: ScMcExerciseEditor,
  state: scMcExerciseState,
  icon: createIcon(faDotCircle),
  title: 'Auswahlaufgabe',
  description:
    'Füge deiner Aufgabe mehrere Single- oder Multiplechoice-Antworten hinzu.'
}
