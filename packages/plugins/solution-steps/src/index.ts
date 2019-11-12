import { createIcon, faCheckSquare } from '@edtr-io/ui'
import {
  child,
  object,
  list,
  StatefulPlugin,
  string,
  boolean
} from '@edtr-io/plugin'

import { SolutionStepsEditor } from './editor'

export const solutionStepsState = object({
  introduction: child('text'),
  solutionSteps: list(
    object({
      type: string('step'),
      isHalf: boolean(),
      content: child('rows')
    })
  )
})

export const solutionStepsPlugin: StatefulPlugin<typeof solutionStepsState> = {
  Component: SolutionStepsEditor,
  state: solutionStepsState,
  icon: createIcon(faCheckSquare),
  title: 'Lösungschritte',
  description: 'Erstelle mit diesem Plugin eine schrittweise Aufgabenlösung.'
}
