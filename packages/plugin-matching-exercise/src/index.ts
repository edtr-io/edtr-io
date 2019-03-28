import { StateType, StatefulPlugin } from '@edtr-io/core'
import * as React from 'react'
import { MatchingExerciseEditor } from './editor'

export const BlockContentProps = StateType.object({
  block: StateType.number(0),
  content: StateType.child()
})
export const SolutionProps = StateType.object({
  number1: StateType.number(0),
  number2: StateType.number(0)
})

export const matchingExerciseState = StateType.object({
  solution: StateType.list(SolutionProps),
  blockContent: StateType.list(BlockContentProps)
})

export const matchingExercisePlugin: StatefulPlugin<
  typeof matchingExerciseState
> = {
  Component: MatchingExerciseEditor,
  state: matchingExerciseState
}

export * from './renderer'
export * from './column'
export * from './row'
