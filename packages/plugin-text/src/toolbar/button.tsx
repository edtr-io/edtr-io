import {
  styled,
  createEditorUiTheme,
  EditorThemeProps
} from '@edtr-io/editor-ui'

// FIXME; Plugin theme
export const createButtonTheme = createEditorUiTheme<ButtonTheme>(theme => {
  return {
    activeColor: theme.primary.background,
    color: theme.color,
    hoverColor: theme.primary.background
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

export interface ButtonTheme {
  activeColor: string
  color: string
  hoverColor: string
}
