import { StatefulPlugin, StateType } from '@edtr-io/core'

import { InputExerciseEditor } from './editor'
import { createIcon, faKeyboard } from '@edtr-io/editor-ui'

export const wrongAnswerObject = StateType.object({
  value: StateType.string(''),
  feedback: StateType.child()
})
export const inputExerciseState = StateType.object({
  type: StateType.string('Text'),
  correctAnswers: StateType.list(StateType.string('')),
  wrongAnswers: StateType.list(wrongAnswerObject)
})
export const inputExercisePlugin: StatefulPlugin<typeof inputExerciseState> = {
  Component: InputExerciseEditor,
  state: inputExerciseState,
  title: 'Eingabefeld',
  icon: createIcon(faKeyboard),
  description: 'Füge deiner Aufgabe ein Eingabefeld für die Lernenden hinzu.'
}
