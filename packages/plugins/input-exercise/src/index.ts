import {
  boolean,
  BooleanStateType,
  child,
  ChildStateType,
  ChildStateTypeConfig,
  EditorPlugin,
  EditorPluginProps,
  list,
  ListStateType,
  object,
  ObjectStateType,
  string,
  StringStateType,
} from '@edtr-io/plugin'
import { DeepPartial } from '@edtr-io/ui'

import { InputExerciseEditor } from './editor'
import { InputExerciseType } from './input-exercise-type'

/**
 * @param config - {@link InputExerciseConfig | Plugin configuration}
  @public */
export function createInputExercisePlugin(
  config: InputExerciseConfig
): EditorPlugin<InputExercisePluginState, InputExerciseConfig> {
  const { feedback } = config

  return {
    Component: InputExerciseEditor,
    config,
    state: createState(),
  }

  function createState(): InputExercisePluginState {
    const answerObject = object({
      value: string(''),
      isCorrect: boolean(),
      feedback: child(feedback),
    })

    return object({
      type: string('input-string-normalized-match-challenge'),
      unit: string(''),
      answers: list(answerObject),
    })
  }
}

/** @public */
export interface InputExerciseConfig {
  feedback: ChildStateTypeConfig
  i18n?: DeepPartial<InputExercisePluginConfig['i18n']>
  theme?: Partial<InputExercisePluginConfig['theme']>
}

/** @public */
export type InputExercisePluginState = ObjectStateType<{
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
export interface InputExercisePluginConfig {
  i18n: {
    types: Record<InputExerciseType, string>
    type: { label: string }
    unit: { label: string }
    answer: {
      label: string
      addLabel: string
      value: {
        placeholder: string
      }
    }
    feedback: { label: string }
    inputPlaceholder: string
    fallbackFeedback: {
      correct: string
      wrong: string
    }
  }
  theme: { borderColor: string; borderStyle: string }
}
export { InputExerciseType }

/** @public */
export type InputExerciseProps = EditorPluginProps<
  InputExercisePluginState,
  InputExerciseConfig
>
