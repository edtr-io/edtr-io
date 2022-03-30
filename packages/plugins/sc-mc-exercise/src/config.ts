import * as R from 'ramda'

import { ScMcExerciseConfig, ScMcExercisePluginConfig } from '.'

export function useScMcExerciseConfig(
  config: ScMcExerciseConfig
): ScMcExercisePluginConfig {
  const { i18n = {} } = config

  return {
    i18n: R.mergeDeepRight(
      {
        types: {
          singleChoice: 'Single-choice',
          multipleChoice: 'Multiple-choice',
        },
        answer: {
          label: 'Answer',
          addLabel: 'Add answer',
          fallbackFeedback: { wrong: 'Wrong' },
        },
        feedback: { label: 'Feedback' },
        globalFeedback: {
          missingCorrectAnswers:
            'Almost! You missed at least one correct answer',
          correct: 'Correct',
          wrong: 'Wrong',
        },
        isSingleChoice: { label: 'Choose the exercise type' },
      },
      i18n
    ),
  }
}
