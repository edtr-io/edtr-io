import {
  boolean,
  child,
  list,
  object,
  EditorPluginProps,
  EditorPlugin
} from '@edtr-io/plugin'

import { ScMcExerciseEditor } from './editor'

/**
 * @param content - Configuration for the content child
 * @param feedback - Configuration for the feedback child
 * @public
 */
export function createScMcExerciseState(
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
/** @public */
export type ScMcExerciseState = ReturnType<typeof createScMcExerciseState>
/** @public */
export type ScMcExerciseProps = EditorPluginProps<ScMcExerciseState>

/** @public */
export function createScMcExercisePlugin({
  content = [],
  feedback = []
}: {
  content?: Parameters<typeof child>
  feedback?: Parameters<typeof child>
} = {}): EditorPlugin<ScMcExerciseState> {
  return {
    Component: ScMcExerciseEditor,
    config: {},
    state: createScMcExerciseState(content, feedback)
  }
}
