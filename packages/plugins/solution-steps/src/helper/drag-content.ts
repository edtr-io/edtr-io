import { StateTypeReturnType } from '@edtr-io/plugin'
import { DropResult } from 'react-beautiful-dnd'

import { findPairs } from './find-pairs'
import { SolutionStepsState } from '..'

export const dragContent = (
  result: DropResult,
  state: StateTypeReturnType<SolutionStepsState>
) => {
  const { solutionSteps } = state
  const { source, destination } = result
  if (!destination) {
    return
  }
  const sortedArray = findPairs(solutionSteps)
  const sourceVal1 = sortedArray[source.index].val1
  const sourceVal2 = sortedArray[source.index].val2
  const destinationVal1 = sortedArray[destination.index].val1
  const destinationVal2 = sortedArray[destination.index].val2

  const movingUpwards = destination.index < source.index
  if (movingUpwards) {
    if (sourceVal2) {
      //move right source before left, so destination index is correct for both movements
      solutionSteps.move(
        sourceVal2.solutionStepIndex,
        destinationVal1.solutionStepIndex
      )
      solutionSteps.move(
        // index of sourceVal1 actually changed, so we need to adapt here
        sourceVal1.solutionStepIndex + 1,
        destinationVal1.solutionStepIndex
      )
    } else {
      solutionSteps.move(
        sourceVal1.solutionStepIndex,
        destinationVal1.solutionStepIndex
      )
    }
  } else {
    const destinationIndex = destinationVal2
      ? destinationVal2.solutionStepIndex
      : destinationVal1.solutionStepIndex

    //move left source before right, so destination index is correct for both movements
    solutionSteps.move(sourceVal1.solutionStepIndex, destinationIndex)
    if (sourceVal2) {
      solutionSteps.move(
        // index of sourceVal2 actually changed, so we need to adapt here
        sourceVal2.solutionStepIndex - 1,
        destinationIndex
      )
    }
  }
}
