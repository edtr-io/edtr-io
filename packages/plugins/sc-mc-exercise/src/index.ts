import { boolean, child, list, object, StatefulPlugin } from '@edtr-io/plugin'
import { createIcon, faDotCircle } from '@edtr-io/ui'

import { ScMcExerciseEditor } from './editor'

function createScMcExerciseState(
  content: Parameters<typeof child>,
  feedback: Parameters<typeof child>
) {
  const AnswerProps = object({
    id: child(...content),
    isCorrect: boolean(false),
    feedback: child(...feedback),
    hasFeedback: boolean(false)
  })

  return object({
    isSingleChoice: boolean(false),
    answers: list(AnswerProps)
  })
}

export type ScMcExercisePluginState = ReturnType<typeof createScMcExerciseState>

export function createScMcExercisePlugin({
  content = [],
  feedback = []
}: {
  content?: Parameters<typeof child>
  feedback?: Parameters<typeof child>
} = {}): StatefulPlugin<ScMcExercisePluginState> {
  return {
    Component: ScMcExerciseEditor,
    config: {},
    state: createScMcExerciseState(content, feedback),
    icon: createIcon(faDotCircle),
    title: 'Auswahlaufgabe',
    description:
      'Füge deiner Aufgabe mehrere Single- oder Multiplechoice-Antworten hinzu.'
  }
}
