import { solutionStep } from '..'
import { StateTypeReturnType } from '@edtr-io/plugin'
import { explanation } from '../editor'

export const findPairs = (
  solutionSteps: StateTypeReturnType<typeof solutionStep>[]
) => {
  type Element = {
    content: typeof solutionSteps[0]
    solutionStepIndex: number
  }

  const pairedList: {
    val1: Element
    val2?: Element
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
