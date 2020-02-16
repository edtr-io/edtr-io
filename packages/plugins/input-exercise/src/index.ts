import {
  boolean,
  child,
  list,
  object,
  string,
  EditorPluginProps,
  EditorPlugin,
  ObjectStateType,
  StringStateType,
  ListStateType,
  BooleanStateType,
  ChildStateType,
  ChildStateTypeConfig
} from '@edtr-io/plugin'

import { InputExerciseEditor } from './editor'

/** @public */
export type InputExerciseState = ObjectStateType<{
  type: StringStateType
  unit: StringStateType
  answers: ListStateType<
    ObjectStateType<{
      value: StringStateType
      isCorrect: BooleanStateType
      feedback: ChildStateType
    }>
  >
}>
/** @public */
export interface InputExerciseConfig {
  theme: { borderColor: string; borderStyle: string }
}
/** @public */
export interface InputExerciseStaticConfig {
  feedback?: ChildStateTypeConfig
}

/** @public */
export type InputExerciseProps = EditorPluginProps<
  InputExerciseState,
  InputExerciseConfig
>

function createInputExerciseState({
  feedback
}: InputExerciseStaticConfig): InputExerciseState {
  const answerObject = object({
    value: string(''),
    isCorrect: boolean(),
    feedback: child(feedback)
  })

  return object({
    type: string('input-string-normalized-match-challenge'),
    unit: string(''),
    answers: list(answerObject)
  })
}

/** @public */
export function createInputExercisePlugin({
  theme = {},
  feedback
}: InputExerciseStaticConfig & {
  theme?: Partial<InputExerciseConfig['theme']>
} = {}): EditorPlugin<InputExerciseState, InputExerciseConfig> {
  return {
    Component: InputExerciseEditor,
    config: defaultTheme => {
      return {
        theme: {
          borderColor: defaultTheme.renderer.primary.background,
          borderStyle: '3px solid',
          ...theme
        }
      }
    },
    state: createInputExerciseState({ feedback })
  }
}
