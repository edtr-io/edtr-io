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
  ChildStateType,
  ChildStateTypeConfig
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
export interface ScMcExerciseStaticConfig {
  content?: ChildStateTypeConfig
  feedback?: ChildStateTypeConfig
}
/** @public */
export type ScMcExerciseProps = EditorPluginProps<ScMcExerciseState>

/**
 * @param content - Configuration for the content child
 * @param feedback - Configuration for the feedback child
 * @public
 */
function createScMcExerciseState({
  content,
  feedback
}: ScMcExerciseStaticConfig): ScMcExerciseState {
  const answerState = object({
    content: child(content),
    isCorrect: boolean(false),
    feedback: child(feedback)
  })

  return object({
    isSingleChoice: boolean(false),
    answers: list(answerState)
  })
}

/**
 * @param config
 * @public
 */
export function createScMcExercisePlugin(
  config: ScMcExerciseStaticConfig = {}
): EditorPlugin<ScMcExerciseState> {
  return {
    Component: ScMcExerciseEditor,
    config: {},
    state: createScMcExerciseState(config)
  }
}
