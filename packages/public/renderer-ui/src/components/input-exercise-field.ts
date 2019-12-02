import {
  styled,
  createRendererUiTheme,
  InputExerciseFieldTheme,
  RendererThemeProps
} from '@edtr-io/ui'
import { ExerciseState, getColor } from './interactive-behaviour'

const createInputExerciseFieldTheme = createRendererUiTheme<
  InputExerciseFieldTheme
>(theme => {
  return {
    borderStyle: '3px solid',
    borderColor: theme.primary.background,
    correctBorderColor: theme.success.background,
    wrongBorderColor: theme.danger.background
  }
})

export const InputExerciseField = styled.input<
  { exerciseState: ExerciseState; width?: number } & RendererThemeProps
>(props => {
  const theme = createInputExerciseFieldTheme('inputExerciseField', props.theme)
  return {
    border: 'none',
    borderBottom: `${theme.borderStyle} ${
      props.exerciseState
        ? getColor(
            {
              defaultColor: theme.borderColor,
              correctColor: theme.correctBorderColor,
              wrongColor: theme.wrongBorderColor
            },
            props.exerciseState
          )
        : theme.borderColor
    }`,
    transition: 'borderColor .5s ease',
    textAlign: 'center',
    outline: 'none',
    width: props.width ? props.width : undefined
  }
})
