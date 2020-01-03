import { StateTypeReturnType } from '@edtr-io/plugin'

import { explanation } from '../editor'
import { SolutionStepsState } from '..'

export const findPairs = (
  solutionSteps: StateTypeReturnType<SolutionStepsState>['solutionSteps']
) => {
  const pairedList: {
    val1: {
      content: typeof solutionSteps[0]
      solutionStepIndex: number
    }
    val2?: {
      content: typeof solutionSteps[0]
      solutionStepIndex: number
    }
  }[] = []
  solutionSteps.forEach((solutionStep, index) => {
    if (!solutionStep.isHalf.value) {
      pairedList.push({
        val1: { content: solutionStep, solutionStepIndex: index }
      })
    } else if (solutionStep.type.value !== explanation) {
      pairedList.push({
        val1: { content: solutionStep, solutionStepIndex: index },
        val2: {
          content: solutionSteps[index + 1],
          solutionStepIndex: index + 1
        }
      })
    }
  })
  return pairedList
}
