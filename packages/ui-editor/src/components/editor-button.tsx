/**
 * @module @edtr-io/editor-ui
 */
/** Comment needed because of https://github.com/christopherthielen/typedoc-plugin-external-module-name/issues/337 */
import {
  createEditorUiTheme,
  EditorThemeProps,
  ButtonTheme,
  styled
} from '@edtr-io/ui'

export const createEditorButtonTheme = createEditorUiTheme<ButtonTheme>(
  theme => {
    return {
      backgroundColor: theme.backgroundColor,
      color: theme.color,
      borderColor: theme.color,
      hoverBackgroundColor: 'rgba(0,0,0,0.50)',
      hoverColor: theme.primary.background,
      hoverBorderColor: theme.primary.background
    }
  }
)

export const EditorButton = styled.button((props: EditorThemeProps) => {
  const theme = createEditorButtonTheme('button', props.theme)

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
