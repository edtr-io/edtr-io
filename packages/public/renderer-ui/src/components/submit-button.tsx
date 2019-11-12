import {
  RendererThemeProps,
  styled,
  createRendererUiTheme,
  SubmitButtonTheme,
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

const createSubmitButtonTheme = createRendererUiTheme<SubmitButtonTheme>(
  theme => {
    return {
      backgroundColor: '#337ab7',
      hoverBackgroundColor: '#d9edf7',
      color: theme.backgroundColor,
      correctBackgroundColor: theme.success.background,
      wrongBackgroundColor: theme.danger.background
    }
  }
)

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

const SubmitButtonComponent = styled.button<
  { exerciseState: ExerciseState } & RendererThemeProps
>(({ exerciseState, ...props }) => {
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
})

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
            Stimmt!
          </span>
        ) : (
          <span>
            <Icon icon={faCheckCircle} />
            Stimmt’s?
          </span>
        )}
      </SubmitButtonComponent>
    )
  }
}
