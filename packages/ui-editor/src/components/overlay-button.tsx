import { createOverlayTheme } from '.'
import { createEditorUiTheme, EditorThemeProps, styled } from '../theme'

export const createOverlayButtonTheme = createEditorUiTheme<ButtonTheme>(
  theme => {
    return {
      backgroundColor: 'transparent',
      color: theme.color,
      borderColor: theme.color,
      hoverBackgroundColor: 'transparent',
      hoverColor: theme.primary.background,
      hoverBorderColor: theme.primary.background
    }
  }
)

export const Button = styled.button((props: EditorThemeProps) => {
  const theme = createOverlayTheme(props.theme)

  return {
    margin: '3px',
    backgroundColor: theme.button.backgroundColor,
    outline: 'none',
    border: `2px solid ${theme.button.borderColor}`,
    color: theme.button.color,
    padding: '10px',
    borderRadius: '4px',
    minWidth: '125px',
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: theme.button.hoverBackgroundColor,
      color: theme.button.hoverColor,
      borderColor: theme.button.hoverBorderColor
    }
  }
})

export interface ButtonTheme {
  backgroundColor: string
  color: string
  borderColor: string
  hoverBackgroundColor: string
  hoverColor: string
  hoverBorderColor: string
}
