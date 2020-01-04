import { StateTypeSerializedType } from '@edtr-io/plugin'

import { SolutionState, createSolutionPlugin } from '../src'

export const name = 'solution'
export const plugin = createSolutionPlugin()

export const states: Record<string, StateTypeSerializedType<SolutionState>> = {}
