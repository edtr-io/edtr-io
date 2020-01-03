import { createSolutionStepsPlugin, SolutionStepsState } from '../src'
import { StateTypeSerializedType } from 'private/plugin-state/dist'

export const name = 'solutionSteps'
export const plugin = createSolutionStepsPlugin()

export const states: Record<
  string,
  StateTypeSerializedType<SolutionStepsState>
> = {}
