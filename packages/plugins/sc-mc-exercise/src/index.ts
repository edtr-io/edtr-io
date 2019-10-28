import { boolean, child, list, object, StatefulPlugin } from '@edtr-io/plugin'
import { createIcon, faDotCircle } from '@edtr-io/ui'

import { ScMcExerciseEditor } from './editor'

export const AnswerProps = object({
  id: child(),
  isCorrect: boolean(false),
  feedback: child(),
  hasFeedback: boolean(false)
})

export const scMcExerciseState = object({
  isSingleChoice: boolean(false),
  answers: list(AnswerProps)
})

export function createScMcExercisePlugin(): StatefulPlugin<
  typeof scMcExerciseState
> {
  return {
    Component: ScMcExerciseEditor,
    config: {},
    state: scMcExerciseState,
    icon: createIcon(faDotCircle),
    title: 'Auswahlaufgabe',
    description:
      'Füge deiner Aufgabe mehrere Single- oder Multiplechoice-Antworten hinzu.'
  }
}
