import * as R from 'ramda'

import { MatchingExerciseRendererState, matchingExerciseState } from '.'
import { Block as B } from './editor'
import { StateDescriptorReturnType } from 'core/src/plugin-state'

export const generateBlocks = ({
  solution,
  blockContent
}: StateDescriptorReturnType<typeof matchingExerciseState>): {
  usedBlocks: number[]
  unusedBlocks: number[]
} => {
  const s = [] as Array<number[]>
  solution().map((number1, number2) => {
    s.concat([number1, number2] as number[])
  })
  const usedBlocks = ([] as number[]).concat(...s)

  const unusedBlocks = blockContent()
    .map((_content, block) => {
      return block
    })
    .filter(block => {
      return usedBlocks.indexOf(block) < 0
    })

  return {
    usedBlocks: usedBlocks,
    unusedBlocks: unusedBlocks
  }
}

export const createBlocks = (blockNumber: number, index: string) => {
  return {
    id: `${index}`,
    block: blockNumber,
    content: blockNumber
  }
}

export const combineBlocks = (
  state: StateDescriptorReturnType<typeof matchingExerciseState>
) => {
  const { usedBlocks, unusedBlocks } = generateBlocks(state)
  return [...usedBlocks, ...unusedBlocks]
}

export const isCorrectPerRow = (
  pluginState: StateDescriptorReturnType<typeof matchingExerciseState>,
  [left, right]: [B | undefined, B | undefined]
) => {
  if (left === undefined || right === undefined) {
    return false
  }

  let correct = true

  const found = pluginState.solution().findIndex(pair => {
    return pair.number1() === left.block && pair.number2() === right.block
  })

  if (found < 0) {
    correct = false
  } else {
    correct
  }
  return correct
}

export const isCorrect = (
  pluginState: StateDescriptorReturnType<typeof matchingExerciseState>,
  state: MatchingExerciseRendererState
) => {
  if (state.leftSide.length !== state.rightSide.length) {
    return false
  }
  const entries = R.zip(state.leftSide, state.rightSide)
  const solutionCheck = entries.every(tuple => {
    return isCorrectPerRow(pluginState, tuple as [B, B])
  })
  const found = foundSolution(pluginState, state)
  return solutionCheck && found
}

export const foundSolution = (
  pluginState: StateDescriptorReturnType<typeof matchingExerciseState>,
  state: MatchingExerciseRendererState
) => {
  const entries = R.zip(state.leftSide, state.rightSide)
  const foundSolutions = pluginState.solution().every(tuple => {
    const found = entries.findIndex(entrytuple => {
      return (
        tuple.number1() === entrytuple[0].block &&
        tuple.number2() === entrytuple[1].block
      )
    })
    return found >= 0
  })
  return foundSolutions
}
