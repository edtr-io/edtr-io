import { StatefulPlugin, StateType } from '@edtr-io/core'
import { createIcon, faKeyboard } from '@edtr-io/editor-ui'
import { createPluginTheme } from '@edtr-io/ui'

import { InputExerciseEditor } from './editor'

export const answerObject = StateType.object({
  value: StateType.string(''),
  isCorrect: StateType.boolean(),
  hasFeedback: StateType.boolean(),
  feedback: StateType.child()
})

export const inputExerciseState = StateType.migratable(
  StateType.object({
    type: StateType.string('Text'),
    correctAnswers: StateType.list(StateType.string('')),
    wrongAnswers: StateType.list(
      StateType.object({
        value: StateType.string(''),
        feedback: StateType.child()
      })
    )
  })
).migrate(
  StateType.object({
    type: StateType.string('Text'),
    answers: StateType.list(answerObject)
  }),
  previousState => {
    const answers = [
      ...previousState.correctAnswers.map(value => {
        return {
          value,
          isCorrect: true,
          hasFeedback: false,
          feedback: { plugin: 'text' }
        }
      }),
      ...previousState.wrongAnswers.map(answer => {
        return {
          value: answer.value,
          isCorrect: false,
          hasFeedback: true,
          feedback: answer.feedback
        }
      })
    ]
    return {
      type: previousState.type,
      answers
    }
  }
)

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
