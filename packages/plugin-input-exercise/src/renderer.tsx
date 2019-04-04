import { StatefulPluginEditorProps } from '@edtr-io/core'
import {
  Feedback,
  createPluginTheme,
  styled,
  EditorThemeProps,
  SubmitButton
} from '@edtr-io/ui'
import A from 'algebra.js'
import * as React from 'react'
import S from 'string'

import { inputExerciseState } from '.'

enum ExerciseState {
  Default = 1,
  SolvedRight,
  SolvedWrong
}

const createInputExerciseTheme = createPluginTheme<InputExerciseTheme>(
  theme => {
    return {
      borderColor: theme.highlightColor,
      borderStyle: '3px solid'
    }
  }
)
const InputExerciseField = styled.input((props: EditorThemeProps) => {
  const theme = createInputExerciseTheme('inputExercise', props.theme)
  return {
    border: 'none',
    borderBottom: `${theme.borderStyle} ${theme.borderColor}`,
    float: 'right',
    textAlign: 'center',
    outline: 'none'
  }
})

export class InputExerciseRenderer extends React.Component<
  StatefulPluginEditorProps<typeof inputExerciseState>,
  InputExerciseRendererState
> {
  public state = {
    positiveFeedback: false,
    negativeFeedbackIndex: -1,
    showFeedback: false,
    exerciseState: ExerciseState.Default
  }
  private input = React.createRef<HTMLInputElement>()

  private checkAnswer = (event: React.FormEvent) => {
    const input = this.input.current

    if (!input) {
      return
    }
    event.preventDefault()
    const { state } = this.props

    var correct = false
    state.correctAnswers().forEach(correctAnswer => {
      if (
        this.matchesInput(
          { type: state.type(), value: correctAnswer() },
          input.value
        )
      ) {
        this.setState({
          positiveFeedback: true,
          showFeedback: true,
          exerciseState: ExerciseState.SolvedRight
        })
        correct = true
      }
    })
    if (!correct) {
      const index = state.wrongAnswers().findIndex(wrongAnswer => {
        return this.matchesInput(
          { type: state.type(), value: wrongAnswer.value() },
          input.value
        )
      })

      this.setState({
        negativeFeedbackIndex: index,
        showFeedback: true,
        positiveFeedback: false,
        exerciseState: this.handleWrongAnswer()
      })
    }
  }

  private handleWrongAnswer = () => {
    setTimeout(
      () => this.setState({ exerciseState: ExerciseState.Default }),
      3000
    )
    return ExerciseState.SolvedWrong
  }

  private matchesInput = (
    field: { type: string; value: string },
    input: string
  ) => {
    try {
      const solution = this.normalize(field.type, field.value)
      const submission = this.normalize(field.type, input)

      switch (field.type) {
        case 'input-expression-equal-match-challenge':
          return (
            (solution as A.Expression)
              .subtract(submission as A.Expression)
              .toString() === '0'
          )
        default:
          return solution === submission
      }
    } catch (err) {
      // e.g. if user input could not be parsed
      return false
    }
  }

  private normalize = (type: string, string: string) => {
    const normalizeNumber = function(string: string) {
      return S(string).replaceAll(',', '.').s
    }
    const temp = S(string).collapseWhitespace()

    switch (type) {
      case 'input-number-exact-match-challenge':
        return S(normalizeNumber((temp as unknown) as string))
          .replaceAll(' /', '/')
          .replaceAll('/ ', '/').s
      case 'input-expression-equal-match-challenge':
        return A.parse(normalizeNumber((temp as unknown) as string))
      default:
        return temp.s.toUpperCase()
    }
  }

  public render() {
    const { state } = this.props
    return (
      <div className="new-text-exercise active">
        <form className="input-challenge-group" onSubmit={this.checkAnswer}>
          <div className="input-challenge-input-wrapper pull-right">
            <InputExerciseField
              data-type={state.type()}
              type="text"
              placeholder="Deine Lösung"
              ref={this.input}
            />
          </div>
          <div
            style={{
              clear: 'both'
            }}
          />
          {this.state.showFeedback ? (
            this.state.positiveFeedback ? (
              <div>
                <Feedback boxFree isTrueAnswer>
                  Sehr gut!
                </Feedback>
              </div>
            ) : this.state.negativeFeedbackIndex !== -1 ? (
              <Feedback boxFree>
                {state
                  .wrongAnswers()
                  [this.state.negativeFeedbackIndex].feedback.render()}
              </Feedback>
            ) : (
              <Feedback boxFree> Leider falsch!</Feedback>
            )
          ) : null}
          <div className="input-challenge-solution">
            <SubmitButton exerciseState={this.state.exerciseState}>
              Submit
            </SubmitButton>
            <div style={{ clear: 'both' }} />
          </div>
        </form>
      </div>
    )
  }
}

interface InputExerciseRendererState {
  positiveFeedback: boolean
  negativeFeedbackIndex: number
  showFeedback: boolean
  exerciseState: ExerciseState
}

interface InputExerciseTheme {
  borderColor: string
  borderStyle: string
}
