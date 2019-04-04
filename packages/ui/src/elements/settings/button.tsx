import { createUiElementTheme, EditorThemeProps, styled } from '@edtr-io/ui'

export const createButtonTheme = createUiElementTheme<ButtonTheme>(theme => {
  return {
    backgroundColor: 'transparent',
    color: theme.color,
    borderColor: theme.color,
    hoverBackgroundColor: 'transparent',
    hoverColor: theme.highlightColor,
    hoverBorderColor: theme.highlightColor
  }
})

export const Button = styled.button((props: EditorThemeProps) => {
  const theme = createButtonTheme('button', props.theme)

  return {
    margin: '3px',
    backgroundColor: theme.backgroundColor,
    outline: 'none',
    border: `2px solid ${theme.borderColor}`,
    color: theme.color,
    padding: '10px',
    borderRadius: '4px',
    minWidth: '125px',
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: theme.hoverBackgroundColor,
      color: theme.hoverColor,
      borderColor: theme.hoverBorderColor
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
