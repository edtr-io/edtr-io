import { createIcon, faKeyboard } from '@edtr-io/editor-ui'
import { legacyChild, legacyList, legacyObject, legacyString, StatefulPlugin } from '@edtr-io/plugin'

import { InputExerciseEditor } from './editor'

export const wrongAnswerObject = legacyObject({
  value: legacyString(''),
  feedback: legacyChild()
})
export const inputExerciseState = legacyObject({
  type: legacyString('Text'),
  correctAnswers: legacyList(legacyString('')),
  wrongAnswers: legacyList(wrongAnswerObject)
})
export const inputExercisePlugin: StatefulPlugin<typeof inputExerciseState> = {
  Component: InputExerciseEditor,
  state: inputExerciseState,
  title: 'Eingabefeld',
  icon: createIcon(faKeyboard),
  description: 'Füge deiner Aufgabe ein Eingabefeld für die Lernenden hinzu.'
}
