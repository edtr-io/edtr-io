import {
  object,
  string,
  StatefulPlugin,
  number,
  boolean
} from '@edtr-io/plugin'

import { TerminatorRenderer } from './renderer'

export const terminatorState = object({
  catalog: string(''),
  addition: number(0),
  multiplication: number(0),
  subtraction: number(0),
  division: number(0),
  power: number(0),
  size: number(0),
  negative: number(0),
  decimals: boolean(false),
  noMixed: boolean(false),
  practiceCount: number(1)
})

export const terminatorPlugin: StatefulPlugin<typeof terminatorState> = {
  Component: TerminatorRenderer,
  state: terminatorState,
  title: 'TERMinator',
  description: 'Trainer für Term- und Bruchaufgaben',
  isEmpty: () => false
}
