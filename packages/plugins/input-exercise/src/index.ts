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
import { DeepPartial } from '@edtr-io/ui'
import * as R from 'ramda'

import { InputExerciseEditor } from './editor'
import { InputExerciseType } from './input-exercise-type'

/**
 * @param config - {@link InputExerciseConfig | Plugin configuration}
 * @public */
export function createInputExercisePlugin(
  config: InputExerciseConfig
): EditorPlugin<InputExercisePluginState, InputExercisePluginConfig> {
  const { i18n = {}, theme = {}, feedback } = config

  return {
    Component: InputExerciseEditor,
    config: defaultTheme => {
      return {
        i18n: R.mergeDeepRight(
          {
            types: {
              [InputExerciseType.InputStringNormalizedMatchChallenge]: 'Text',
              [InputExerciseType.InputNumberExactMatchChallenge]: 'Number',
              [InputExerciseType.InputExpressionEqualMatchChallenge]:
                'Mathematical expression'
            },
            type: {
              label: 'Choose the exercise type'
            },
            unit: {
              label: 'Unit'
            },
            answer: {
              addLabel: 'Add answer',
              value: {
                placeholder: 'Enter the value'
              }
            },
            inputPlaceholder: 'Your solution',
            fallbackFeedback: {
              correct: 'Correct',
              wrong: 'Wrong'
            }
          },
          i18n
        ),
        theme: {
          borderColor: defaultTheme.renderer.primary.background,
          borderStyle: '3px solid',
          ...theme
        }
      }
    },
    state: createState()
  }

  function createState(): InputExercisePluginState {
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
    type: {
      label: string
    }
    unit: {
      label: string
    }
    answer: {
      addLabel: string
      value: {
        placeholder: string
      }
    }
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
  InputExercisePluginConfig
>
