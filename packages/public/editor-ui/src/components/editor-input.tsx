/**
 * @module @edtr-io/editor-ui
 */
/** Comment needed because of https://github.com/christopherthielen/typedoc-plugin-external-module-name/issues/337 */
import {
  createEditorUiTheme,
  InputTheme,
  EditorThemeProps,
  styled
} from '@edtr-io/ui'
import * as React from 'react'

export const createEditorInputTheme = createEditorUiTheme<InputTheme>(theme => {
  return {
    color: theme.backgroundColor,
    backgroundColor: 'transparent',
    highlightColor: theme.primary.background
  }
})

const EditorInputLabel = styled.label(
  (props: EditorThemeProps & { width: string | undefined }) => {
    const theme = createEditorInputTheme('input', props.theme)

    return {
      width: props.width,
      color: theme.color
    }
  }
)

const EditorInputInner = styled.input(
  (props: EditorThemeProps & { textWidth: string | undefined }) => {
    const theme = createEditorInputTheme('input', props.theme)

    return {
      backgroundColor: theme.backgroundColor,
      border: 'none',
      width: props.textWidth,
      borderBottom: `2px solid ${theme.color}`,
      color: theme.color,
      paddingLeft: '10px',
      '&:focus': {
        outline: 'none',
        borderBottom: `2px solid ${theme.highlightColor}`
      }
    }
  }
)

const EditorInputRefForward: React.RefForwardingComponent<
  HTMLInputElement,
  InputProps
> = (props, ref) => {
  const { label, ...rest } = props
  return (
    <EditorInputLabel width={rest.editorInputWidth}>
      {label}
      <EditorInputInner textWidth={rest.textfieldWidth} {...rest} ref={ref} />
    </EditorInputLabel>
  )
}

export const EditorInput = React.forwardRef(EditorInputRefForward)

export interface InputProps
  extends React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  > {
  label?: string
  textfieldWidth?: string
  editorInputWidth?: string
}
