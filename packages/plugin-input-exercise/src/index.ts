import { createIcon, faKeyboard } from '@edtr-io/editor-ui'
import {
  boolean,
  child,
  list,
  object,
  StatefulPlugin,
  string
} from '@edtr-io/plugin'
import { createPluginTheme } from '@edtr-io/ui'

import { InputExerciseEditor } from './editor'

export const answerObject = object({
  value: string(''),
  isCorrect: boolean(),
  feedback: child()
})
export const inputExerciseState = object({
  type: string('Text'),
  answers: list(answerObject)
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
