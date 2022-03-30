import { useTheme } from '@edtr-io/ui'
import * as R from 'ramda'

import {
  InputExerciseConfig,
  InputExercisePluginConfig,
  InputExerciseType,
} from '.'

export function useInputExerciseConfig(
  config: InputExerciseConfig
): InputExercisePluginConfig {
  const { i18n = {}, theme = {} } = config
  const defaultTheme = useTheme()

  return {
    i18n: R.mergeDeepRight(
      {
        types: {
          [InputExerciseType.InputStringNormalizedMatchChallenge]: 'Text',
          [InputExerciseType.InputNumberExactMatchChallenge]: 'Number',
          [InputExerciseType.InputExpressionEqualMatchChallenge]:
            'Mathematical expression',
        },
        type: { label: 'Choose the exercise type' },
        unit: { label: 'Unit' },
        answer: {
          label: 'Answer',
          addLabel: 'Add answer',
          value: { placeholder: 'Enter the value' },
        },
        feedback: { label: 'Feedback' },
        inputPlaceholder: 'Your solution',
        fallbackFeedback: { correct: 'Correct', wrong: 'Wrong' },
      },
      i18n
    ),
    theme: {
      borderColor: defaultTheme.renderer.primary.background,
      borderStyle: '3px solid',
      ...theme,
    },
  }
}
