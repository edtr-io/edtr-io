import { InputExerciseEditor } from './editor'
import { StatefulPlugin, StateType } from '@edtr-io/core'

export const wrongAnswerObject = StateType.object({
  id: StateType.child(),
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
  state: inputExerciseState
}
