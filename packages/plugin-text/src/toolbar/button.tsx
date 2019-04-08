import {
  defaultTheming,
  styled,
  createUiElementTheme,
  EditorThemeProps
} from '@edtr-io/ui'

export const createButtonTheme = createUiElementTheme<ButtonTheme>(theme => {
  return {
    activeColor: theme.highlightColor,
    color: theme.color,
    hoverColor: theme.highlightColor
  }
})

export const Button = styled.button<{ active?: boolean }>(
  ({ active, ...props }: { active?: boolean } & EditorThemeProps) => {
    const theme = createButtonTheme('button', props.theme)
    return {
      backgroundColor: 'transparent',
      cursor: 'pointer',
      color: active ? theme.activeColor : theme.color,
      outline: 'none',
      height: '25px',
      border: 'none',
      width: '40px',
      '&:hover': {
        color: theme.hoverColor
      }
    }
  }
)
Button.defaultProps = { theme: defaultTheming }

export interface ButtonTheme {
  activeColor: string
  color: string
  hoverColor: string
}
