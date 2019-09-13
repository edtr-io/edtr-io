import { createIcon, faDotCircle } from '@edtr-io/editor-ui'
import { legacyBoolean, legacyChild, legacyList, object, StatefulPlugin } from '@edtr-io/plugin'

import { ScMcExerciseEditor } from './editor'

export const AnswerProps = object({
  id: legacyChild(),
  isCorrect: legacyBoolean(false),
  feedback: legacyChild(),
  hasFeedback: legacyBoolean(false)
})

export const scMcExerciseState = object({
  isSingleChoice: legacyBoolean(false),
  answers: legacyList(AnswerProps)
})

export const scMcExercisePlugin: StatefulPlugin<typeof scMcExerciseState> = {
  Component: ScMcExerciseEditor,
  state: scMcExerciseState,
  icon: createIcon(faDotCircle),
  title: 'Auswahlaufgabe',
  description:
    'Füge deiner Aufgabe mehrere Single- oder Multiplechoice-Antworten hinzu.'
}
