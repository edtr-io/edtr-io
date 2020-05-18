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
  ChildStateTypeConfig,
} from '@edtr-io/plugin'
import { DeepPartial } from '@edtr-io/ui'
import * as R from 'ramda'

import { ScMcExerciseEditor } from './editor'

/**
 * @param config - {@link ScMcExerciseConfig | Plugin configuration}
 * @public
 */
export function createScMcExercisePlugin(
  config: ScMcExerciseConfig
): EditorPlugin<ScMcExercisePluginState, ScMcExercisePluginConfig> {
  const { i18n = {}, content, feedback } = config

  return {
    Component: ScMcExerciseEditor,
    config: {
      i18n: R.mergeDeepRight(
        {
          types: {
            singleChoice: 'Single-choice',
            multipleChoice: 'Multiple-choice',
          },
          isSingleChoice: {
            label: 'Choose the exercise type',
          },
          answer: {
            addLabel: 'Add answer',
            fallbackFeedback: {
              wrong: 'Wrong',
            },
          },
          globalFeedback: {
            missingCorrectAnswers:
              'Almost! You missed at least one correct answer',
            correct: 'Correct',
            wrong: 'Wrong',
          },
        },
        i18n
      ),
    },
    state: createState(),
  }

  function createState(): ScMcExercisePluginState {
    const answerState = object({
      content: child(content),
      isCorrect: boolean(false),
      feedback: child(feedback),
    })

    return object({
      isSingleChoice: boolean(false),
      answers: list(answerState),
    })
  }
}

/** @public */
export interface ScMcExerciseConfig
  extends Omit<ScMcExercisePluginConfig, 'i18n'> {
  content: ChildStateTypeConfig
  feedback: ChildStateTypeConfig
  i18n?: DeepPartial<ScMcExercisePluginConfig['i18n']>
}

/** @public */
export type ScMcExercisePluginState = ObjectStateType<{
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
export interface ScMcExercisePluginConfig {
  i18n: {
    types: {
      singleChoice: string
      multipleChoice: string
    }
    isSingleChoice: {
      label: string
    }
    answer: {
      addLabel: string
      fallbackFeedback: {
        wrong: string
      }
    }
    globalFeedback: {
      correct: string
      missingCorrectAnswers: string
      wrong: string
    }
  }
}

/** @public */
export type ScMcExerciseProps = EditorPluginProps<
  ScMcExercisePluginState,
  ScMcExercisePluginConfig
>
