import {
  child,
  object,
  list,
  StatefulPlugin,
  string,
  boolean
} from '@edtr-io/plugin'
import { createIcon, faCheckSquare } from '@edtr-io/ui'

import { SolutionStepsEditor } from './editor'

export const solutionStep = object({
  type: string('step'),
  isHalf: boolean(),
  content: child('rows')
})

export const solutionStepsState = object({
  introduction: child('text'),
  strategy: child('rows'),
  hasStrategy: boolean(),
  solutionSteps: list(solutionStep),
  additionals: child('rows'),
  hasAdditionals: boolean()
})

export const solutionStepsPlugin: StatefulPlugin<typeof solutionStepsState> = {
  Component: SolutionStepsEditor,
  state: solutionStepsState,
  icon: createIcon(faCheckSquare),
  title: 'Lösungschritte',
  description: 'Erstelle mit diesem Plugin eine schrittweise Aufgabenlösung.'
}
