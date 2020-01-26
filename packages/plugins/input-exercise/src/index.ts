import {
  boolean,
  child,
  list,
  object,
  string,
  EditorPluginProps,
  EditorPlugin
} from '@edtr-io/plugin'

import { InputExerciseEditor } from './editor'

/**
 * @param feedback - Configuration for the feedback child
 * @public
 */
export function createInputExerciseState(feedback: Parameters<typeof child>) {
  const answerObject = object({
    value: string(''),
    isCorrect: boolean(),
    feedback: child(...feedback)
  })

  return object({
    type: string('input-string-normalized-match-challenge'),
    unit: string(''),
    answers: list(answerObject)
  })
}
/** @public */
export type InputExerciseState = ReturnType<typeof createInputExerciseState>
/** @public */
export interface InputExerciseConfig {
  theme: { borderColor: string; borderStyle: string }
}
/** @public */
export type InputExerciseProps = EditorPluginProps<
  InputExerciseState,
  InputExerciseConfig
>

/** @public */
export function createInputExercisePlugin({
  theme = {},
  feedback = []
}: {
  theme?: Partial<InputExerciseConfig['theme']>
  feedback?: Parameters<typeof child>
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
    state: createInputExerciseState(feedback)
  }
}
