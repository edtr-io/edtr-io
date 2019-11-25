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

import { ExerciseState, getColor } from './interactive-color-rules'

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

const SubmitButtonComponent = styled.button<
  { exerciseState: ExerciseState; disabled: boolean } & RendererThemeProps
>(({ exerciseState, disabled, ...props }) => {
  const theme = createSubmitButtonTheme('submitButton', props.theme)

  return {
    float: 'right',
    margin: '10px 0px',
    border: 'none',
    padding: '3px',
    backgroundColor: disabled
      ? 'lightgrey'
      : getColor(
          {
            defaultColor: theme.backgroundColor,
            correctColor: theme.correctBackgroundColor,
            wrongColor: theme.wrongBackgroundColor
          },
          exerciseState
        ),
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
  disabled?: boolean
  onClick?: () => void
}> {
  public render() {
    return (
      <SubmitButtonComponent
        exerciseState={this.props.exerciseState}
        onClick={this.props.onClick}
        disabled={this.props.disabled ? this.props.disabled : false}
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
