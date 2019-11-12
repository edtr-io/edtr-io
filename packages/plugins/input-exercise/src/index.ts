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

function createInputExerciseState(feedback: Parameters<typeof child>) {
  const stateV0 = object({
    type: string('Text'),
    correctAnswers: list(string('')),
    wrongAnswers: list(
      object({
        value: string(''),
        feedback: child(...feedback)
      })
    )
  })

  const answerObject = object({
    value: string(''),
    isCorrect: boolean(),
    feedback: child(...feedback)
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

  return migratable(stateV0)
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
}

export type InputExercisePluginState = ReturnType<
  typeof createInputExerciseState
>

export function createInputExercisePlugin({
  theme = {},
  feedback = []
}: {
  theme?: Partial<InputExercisePluginConfig['theme']>
  feedback?: Parameters<typeof child>
} = {}): StatefulPlugin<InputExercisePluginState, InputExercisePluginConfig> {
  return {
    Component: InputExerciseEditor,
    config: defaultTheme => {
      return {
        theme: {
          borderColor: defaultTheme.renderer.primary.background,
          borderStyle: '3px solid',
          ...theme
        }
      }
    },
    state: createInputExerciseState(feedback),
    title: 'Eingabefeld',
    icon: createIcon(faKeyboard),
    description: 'Füge deiner Aufgabe ein Eingabefeld für die Lernenden hinzu.'
  }
}

export interface InputExercisePluginConfig {
  theme: { borderColor: string; borderStyle: string }
}
