import { StatefulPlugin, StateType } from '@edtr-io/core'

import { InputExerciseEditor } from './editor'
import { createIcon, faKeyboard } from '@edtr-io/editor-ui'
import { createPluginTheme } from '@edtr-io/ui'

export const answerObject = StateType.object({
  value: StateType.string(''),
  isCorrect: StateType.boolean(),
  hasFeedback: StateType.boolean(),
  feedback: StateType.child()
})
export const inputExerciseState = StateType.object({
  type: StateType.string('Text'),
  answers: StateType.list(answerObject)
})
export const inputExercisePlugin: StatefulPlugin<typeof inputExerciseState> = {
  Component: InputExerciseEditor,
  state: inputExerciseState,
  title: 'Eingabefeld',
  icon: createIcon(faKeyboard),
  description: 'Füge deiner Aufgabe ein Eingabefeld für die Lernenden hinzu.'
}

export const createInputExerciseTheme = createPluginTheme<InputExerciseTheme>(
  theme => {
    return {
      borderColor: theme.renderer.primary.background,
      borderStyle: '3px solid'
    }
  }
)

interface InputExerciseTheme {
  borderColor: string
  borderStyle: string
}
