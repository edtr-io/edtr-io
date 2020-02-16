import { styled, useEditorUiTheme } from '@edtr-io/ui'

/** @public */
export const EditorButton = styled.button(() => {
  const theme = useEditorUiTheme('button', theme => {
    return {
      backgroundColor: theme.backgroundColor,
      color: theme.color,
      borderColor: theme.color,
      hoverBackgroundColor: 'rgba(0,0,0,0.50)',
      hoverColor: theme.primary.background,
      hoverBorderColor: theme.primary.background
    }
  })
  return {
    margin: '3px',
    backgroundColor: theme.backgroundColor,
    outline: 'none',
    border: 'none',
    boxShadow: '0 1px 2px 0 rgba(0,0,0,0.50)',
    color: theme.color,
    borderRadius: '4px',
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: theme.hoverBackgroundColor,
      color: theme.hoverColor,
      borderColor: theme.hoverBorderColor
    }
  }
})
