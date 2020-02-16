import {
  boolean,
  child,
  list,
  object,
  EditorPluginProps,
  EditorPlugin,
  ObjectStateType,
  BooleanStateType,
  ListStateType,
  ChildStateType
} from '@edtr-io/plugin'

import { ScMcExerciseEditor } from './editor'

/** @public */
export type ScMcExerciseState = ObjectStateType<{
  isSingleChoice: BooleanStateType
  answers: ListStateType<
    ObjectStateType<{
      content: ChildStateType
      isCorrect: BooleanStateType
      feedback: ChildStateType
    }>
  >
}>
/** @public */
export type ScMcExerciseProps = EditorPluginProps<ScMcExerciseState>

/**
 * @param content - Configuration for the content child
 * @param feedback - Configuration for the feedback child
 * @public
 */
function createScMcExerciseState(
  content: Parameters<typeof child>,
  feedback: Parameters<typeof child>
): ScMcExerciseState {
  const answerState = object({
    content: child(...content),
    isCorrect: boolean(false),
    feedback: child(...feedback)
  })

  return object({
    isSingleChoice: boolean(false),
    answers: list(answerState)
  })
}

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
