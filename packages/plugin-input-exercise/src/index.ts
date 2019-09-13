import { createIcon, faKeyboard } from '@edtr-io/editor-ui'
import { child, list, object, legacyString, StatefulPlugin } from '@edtr-io/plugin'

import { InputExerciseEditor } from './editor'

export const wrongAnswerObject = object({
  value: legacyString(''),
  feedback: child()
})
export const inputExerciseState = object({
  type: legacyString('Text'),
  correctAnswers: list(legacyString('')),
  wrongAnswers: list(wrongAnswerObject)
})
export const inputExercisePlugin: StatefulPlugin<typeof inputExerciseState> = {
  Component: InputExerciseEditor,
  state: inputExerciseState,
  title: 'Eingabefeld',
  icon: createIcon(faKeyboard),
  description: 'Füge deiner Aufgabe ein Eingabefeld für die Lernenden hinzu.'
}
