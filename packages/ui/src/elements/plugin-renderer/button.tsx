import {
  createPluginTheme,
  EditorThemeProps,
  styled,
  Icon,
  faSmile,
  faCheckCircle
} from '@edtr-io/ui'
import * as React from 'react'

enum ExerciseState {
  Default = 1,
  SolvedRight,
  SolvedWrong
}

const createSubmitButtonTheme = createPluginTheme<SubmitButtonTheme>(theme => {
  return {
    backgroundColor: theme.buttonBackgroundColor,
    hoverBackgroundColor: theme.highlightColor,
    color: theme.buttonTextColor,
    correctBackgroundColor: '#95bc1a',
    wrongBackgroundColor: '#f7b07c'
  }
})

const getBackgroundColor = (
  theme: SubmitButtonTheme,
  exerciseState: ExerciseState
) => {
  switch (exerciseState) {
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

const SubmitButtonComponent = styled.button(
  ({
    exerciseState,
    ...props
  }: { exerciseState: ExerciseState } & EditorThemeProps) => {
    const theme = createSubmitButtonTheme('submitButton', props.theme)

    return {
      float: 'right',
      margin: '10px 0px',
      border: 'none',
      padding: '3px',
      backgroundColor: getBackgroundColor(theme, exerciseState),
      color: theme.color,
      transition: 'background-color .5s ease',
      outline: 'none',
      '&hover': {
        backgroundColor: theme.hoverBackgroundColor
      }
    }
  }
)

export class SubmitButton extends React.Component<{
  exerciseState: ExerciseState
  onClick?: () => void
}> {
  public render() {
    return (
      <SubmitButtonComponent
        exerciseState={this.props.exerciseState}
        onClick={this.props.onClick}
      >
        {this.props.exerciseState === ExerciseState.SolvedRight ? (
          <span>
            <Icon icon={faSmile} />
            {' Stimmt!'}
          </span>
        ) : (
          <span>
            <Icon icon={faCheckCircle} />
            {' Stimmt´s?'}
          </span>
        )}
      </SubmitButtonComponent>
    )
  }
}

export interface SubmitButtonTheme {
  backgroundColor: string
  hoverBackgroundColor: string
  color: string
  correctBackgroundColor: string
  wrongBackgroundColor: string
}
