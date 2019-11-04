import {
  boolean,
  child,
  list,
  migratable,
  object,
  StatefulPlugin,
  StateTypeSerializedType,
  string
} from '@edtr-io/plugin'
import { createIcon, createPluginTheme, faKeyboard } from '@edtr-io/ui'

import { InputExerciseEditor } from './editor'

const stateV0 = object({
  type: string('Text'),
  correctAnswers: list(string('')),
  wrongAnswers: list(
    object({
      value: string(''),
      feedback: child()
    })
  )
})

const answerObject = object({
  value: string(''),
  isCorrect: boolean(),
  feedback: child()
})
const stateV1 = object({
  type: string('Text'),
  answers: list(answerObject)
})

const stateV2 = object({
  type: string('input-string-normalized-match-challenge'),
  unit: string(''),
  answers: list(answerObject)
})

export const inputExerciseState = migratable(stateV0)
  .migrate(stateV1, previousState => {
    return {
      type: previousState.type,
      answers: [
        ...previousState.correctAnswers.map(answer => {
          return {
            value: answer,
            isCorrect: true,
            feedback: { plugin: 'text' } as StateTypeSerializedType<
              ReturnType<typeof child>
            >
          }
        }),
        ...previousState.wrongAnswers.map(answer => {
          return {
            ...answer,
            isCorrect: false
          }
        })
      ]
    }
  })
  .migrate(stateV2, previousState => {
    return {
      ...previousState,
      unit: ''
    }
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
