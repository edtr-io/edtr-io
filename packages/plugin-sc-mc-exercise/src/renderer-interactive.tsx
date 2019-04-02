import { StatefulPluginEditorProps, StateType } from '@edtr-io/core'
import {
  Feedback,
  styled,
  createPluginTheme,
  EditorThemeProps
} from '@edtr-io/ui'
import * as R from 'ramda'
import * as React from 'react'

import { ScMcAnswersRenderer } from './answers-renderer'
import { ScMcExerciseChoiceRenderer } from './choice-renderer'
import { scMcState, AnswerProps } from '.'

enum ExerciseState {
  Default = 1,
  SolvedRight,
  SolvedWrong
}

export const createSubmitButtonTheme = createPluginTheme<SubmitButtonTheme>(
  theme => {
    return {
      backgroundColor: theme.backgroundColor,
      hoverBackgroundColor: theme.highlightColor,
      color: theme.color,
      correctBackgroundColor: '#95bc1a',
      wrongBackgroundColor: '#f7b07c'
    }
  }
)

export class ScMcRendererInteractive extends React.Component<
  ScMcRendererInteractiveProps,
  ScMcRendererState
> {
  public static defaultProps = {
    getFeedback: () => undefined
  }

  public constructor(props: ScMcRendererInteractiveProps) {
    super(props)
    this.state = {
      buttons: props.state.answers().map(() => {
        return {
          selected: false,
          showFeedback: false
        }
      }),
      globalFeedback: '',
      showGlobalFeedback: false,
      solved: false,
      exerciseState: ExerciseState.Default
    }
  }

  public render() {
    return (
      <React.Fragment>
        <ScMcAnswersRenderer
          state={this.props.state}
          showAnswer={this.showAnswer}
        />
        {this.showGlobalFeedback()}
        {this.showSubmitButton()}
      </React.Fragment>
    )
  }
  private showAnswer = (
    answer: StateType.StateDescriptorReturnType<typeof AnswerProps>,
    index: number,
    centered: boolean
  ): React.ReactNode => {
    const button = this.state.buttons[index]
    return (
      <React.Fragment key={index}>
        <ScMcExerciseChoiceRenderer
          index={index}
          onClick={this.selectButton(index)}
          {...this.props} // showFeedback: true
          {...button} // showFeedback: false
          centered={centered}
        >
          {answer.id.render()}
        </ScMcExerciseChoiceRenderer>
        {this.props.showFeedback ? this.showFeedback({ button, answer }) : null}
      </React.Fragment>
    )
  }

  private showFeedback({
    answer,
    button
  }: {
    answer: StateType.StateDescriptorReturnType<typeof AnswerProps>
    button: Button
  }): React.ReactNode {
    if (!button.showFeedback) {
      return null
    }
    if (answer.hasFeedback()) {
      return <Feedback>{answer.feedback.render()}</Feedback>
    }
    if (answer.isCorrect()) {
      return null
    }
    return <Feedback>Leider falsch! versuche es doch noch einmal!</Feedback>
  }
  private showGlobalFeedback(): React.ReactNode {
    const { showGlobalFeedback, globalFeedback, solved } = this.state
    if (showGlobalFeedback) {
      return (
        <Feedback boxFree isTrueAnswer={solved}>
          {globalFeedback}
        </Feedback>
      )
    }
    return null
  }

  private showSubmitButton(): React.ReactNode {
    return (
      <this.SubmitButton onClick={this.submitAnswer}>Submit</this.SubmitButton>
    )
  }

  private submitAnswer = () => {
    const { buttons } = this.state
    const temp = R.zip(buttons, this.props.state.answers())
    const mistakes = R.reduce(
      (acc, [button, answer]) => {
        return acc + (answer.isCorrect() !== button.selected ? 1 : 0)
      },
      0,
      temp
    )
    const missingSolutions = R.reduce(
      (acc, [button, answer]) => {
        return acc + (answer.isCorrect() && !button.selected ? 1 : 0)
      },
      0,
      temp
    )

    const nextButtonStates = buttons.map((button, i) => {
      return this.props.nextButtonStateAfterSubmit({
        button,
        answer: this.props.state.answers()[i],
        mistakes,
        missingSolutions
      })
    })

    this.setState({
      showGlobalFeedback: true,
      buttons: nextButtonStates,
      solved: mistakes === 0,
      exerciseState:
        mistakes === 0 ? ExerciseState.SolvedRight : this.handleWrongAnswer(),
      globalFeedback: this.getGlobalFeedback({ mistakes, missingSolutions })
    })
  }

  private handleWrongAnswer = () => {
    setTimeout(
      () => this.setState({ exerciseState: ExerciseState.Default }),
      3000
    )
    return ExerciseState.SolvedWrong
  }

  private selectButton = (selectedIndex: number) => () => {
    const { buttons } = this.state

    if (this.props.state.isSingleChoice()) {
      this.setState({
        buttons: buttons.map((button, index) => {
          return R.assoc('selected', index === selectedIndex, button)
        })
      })
    } else {
      this.setState({
        buttons: R.adjust(
          // @ts-ignore FIXME: bug in @types/ramda
          selectedIndex,
          button => R.assoc('selected', !button.selected, button),
          buttons
        ),
        globalFeedback: ''
      })
    }
  }
  private getGlobalFeedback({
    mistakes,
    missingSolutions
  }: {
    mistakes: number
    missingSolutions: number
  }): string {
    const { getFeedback } = this.props
    const feedback =
      typeof getFeedback === 'function' &&
      getFeedback({
        mistakes,
        missingSolutions
      })

    if (feedback) {
      return feedback
    }

    if (mistakes === 0) {
      return 'Sehr gut!'
    } else {
      return 'Das stimmt so leider nicht.'
    }
  }

  private SubmitButton = styled.button((props: EditorThemeProps) => {
    const theme = createSubmitButtonTheme('submitButton', props.theme)

    return {
      float: 'right',
      margin: '10px 0px',
      backgroundColor: this.getBackgroundColor(theme),
      color: theme.color,
      transition: 'background-color .5s ease',
      outline: 'none',
      '&hover': {
        backgroundColor: theme.hoverBackgroundColor
      }
    }
  })

  private getBackgroundColor = (theme: SubmitButtonTheme) => {
    switch (this.state.exerciseState) {
      case ExerciseState.Default: {
        return theme.backgroundColor
      }
      case ExerciseState.SolvedRight: {
        return theme.correctBackgroundColor
      }
      case ExerciseState.SolvedWrong: {
        return theme.wrongBackgroundColor
      }
    }
  }
}

export interface SubmitButtonTheme {
  backgroundColor: string
  hoverBackgroundColor: string
  color: string
  correctBackgroundColor: string
  wrongBackgroundColor: string
}

export type ScMcRendererInteractiveProps = StatefulPluginEditorProps<
  typeof scMcState
> & {
  getFeedback?: (params: {
    mistakes: number
    missingSolutions: number
  }) => string | undefined
  nextButtonStateAfterSubmit: (params: {
    button: Button
    answer: StateType.StateDescriptorReturnType<typeof AnswerProps>
    mistakes: number
    missingSolutions: number
  }) => Button
  showFeedback?: boolean
}

export interface ScMcRendererState {
  buttons: Button[]
  globalFeedback: string
  showGlobalFeedback: boolean
  solved: boolean
  exerciseState: ExerciseState
}

export interface Button {
  selected: boolean
  showFeedback: boolean
}
