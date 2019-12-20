import {
  boolean,
  child,
  list,
  object,
  EditorPluginProps
} from '@edtr-io/plugin'

import { ScMcExerciseEditor } from './editor'

function createScMcExerciseState(
  content: Parameters<typeof child>,
  feedback: Parameters<typeof child>
) {
  const answerState = object({
    id: child(...content),
    isCorrect: boolean(false),
    feedback: child(...feedback),
    hasFeedback: boolean(false)
  })

  return object({
    isSingleChoice: boolean(false),
    answers: list(answerState)
  })
}
export type ScMcExerciseState = ReturnType<typeof createScMcExerciseState>
export type ScMcExerciseProps = EditorPluginProps<ScMcExerciseState>

export function createScMcExercisePlugin({
  content = [],
  feedback = []
}: {
  content?: Parameters<typeof child>
  feedback?: Parameters<typeof child>
} = {}) {
  return {
    Component: ScMcExerciseEditor,
    config: {},
    state: createScMcExerciseState(content, feedback)
  }
}
