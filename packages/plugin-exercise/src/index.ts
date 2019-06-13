import { StatefulPlugin, StateType } from '@edtr-io/core'

import { ExerciseEditor } from './editor'
import { createIcon, faCopy } from '@edtr-io/editor-ui'

export const exerciseState = StateType.object({
  question: StateType.child('rows'),
  solution: StateType.child('solution')
})

export const exercisePlugin: StatefulPlugin<typeof exerciseState> = {
  Component: ExerciseEditor,
  state: exerciseState,
  icon: createIcon(faCopy),
  title: 'Aufgabe',
  description: 'Hier kannst du eine Aufgabe erstellen.'
}
