import { StatefulPluginEditorProps } from '@edtr-io/core'
import { Feedback, SubmitButton } from '@edtr-io/renderer-ui'
import { styled } from '@edtr-io/editor-ui'
import { ThemeProps } from '@edtr-io/ui'
import A from 'algebra.js'
import * as React from 'react'
import S from 'string'

import { inputExerciseState, createInputExerciseTheme } from '.'

enum ExerciseState {
  Default = 1,
  SolvedRight,
  SolvedWrong
}

const InputExerciseField = styled.input<{ name: string } & ThemeProps>(
  ({ name, ...props }) => {
    const theme = createInputExerciseTheme(name, props.theme)
    return {
      border: 'none',
      borderBottom: `${theme.borderStyle} ${theme.borderColor}`,
      float: 'right',
      textAlign: 'center',
      outline: 'none',
      marginBottom: '10px'
    }
  }
)

export class InputExerciseRenderer extends React.Component<
  StatefulPluginEditorProps<typeof inputExerciseState>,
  InputExerciseRendererState
> {
  public state = {
    positiveFeedback: false,
    feedbackIndex: -1,
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

    state.answers().forEach((answer, index) => {
      if (
        this.matchesInput(
          { type: state.type(), value: answer.value() },
          input.value
        )
      ) {
        this.setState({
          positiveFeedback: answer.isCorrect(),
          feedbackIndex: index,
          showFeedback: true,
          exerciseState: answer.isCorrect
            ? ExerciseState.SolvedRight
            : this.handleWrongAnswer()
        })
      }
    })
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
      <div>
        <form onSubmit={this.checkAnswer}>
          <div>
            <InputExerciseField
              name={this.props.name}
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
            <Feedback boxFree isTrueAnswer={this.state.positiveFeedback}>
              {state.answers()[this.state.feedbackIndex].feedback()}
            </Feedback>
          ) : null}

          <div>
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
  feedbackIndex: number
  showFeedback: boolean
  exerciseState: ExerciseState
}
