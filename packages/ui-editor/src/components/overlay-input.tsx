/**
 * @module @edtr-io/editor-ui
 */
/** Comment needed because of https://github.com/christopherthielen/typedoc-plugin-external-module-name/issues/337 */
import {
  createEditorUiTheme,
  EditorThemeProps,
  InputTheme,
  styled
} from '@edtr-io/ui'
import * as React from 'react'

import { createOverlayTheme } from './settings-overlay'

export const createOverlayInputTheme = createEditorUiTheme<InputTheme>(
  theme => {
    return {
      backgroundColor: 'transparent',
      color: theme.color,
      highlightColor: theme.primary.background
    }
  }
)

const InputLabel = styled.label((props: EditorThemeProps) => {
  const theme = createOverlayTheme(props.theme)

  return {
    color: theme.input.color,
    margin: '20px auto 0px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  }
})

const InputLabelInner = styled.span({ width: '20%' })

const InputInner = styled.input((props: EditorThemeProps) => {
  const theme = createOverlayTheme(props.theme)

  return {
    backgroundColor: theme.input.backgroundColor,
    border: 'none',
    borderBottom: `2px solid ${theme.input.color}`,
    color: theme.input.color,
    width: '75%',
    '&:focus': {
      outline: 'none',
      borderBottom: `2px solid ${theme.input.highlightColor}`
    }
  }
})

const OverlayInputRefForward : React.RefForwardingComponent<HTMLInputElement, InputProps> = (props, ref) => {
  const { label, ...rest } = props
  return (
    <InputLabel>
      <InputLabelInner>{label}</InputLabelInner>
      <InputInner {...rest} ref={ref}/>
    </InputLabel>
  )
}
export const OverlayInput = React.forwardRef(OverlayInputRefForward)

const InlineInputInner = styled.input((props: EditorThemeProps) => {
  const theme = createOverlayTheme(props.theme)

  return {
    backgroundColor: theme.input.backgroundColor,
    border: 'none',
    borderBottom: `2px solid ${theme.input.color}`,
    color: theme.input.color,
    '&:focus': {
      outline: 'none',
      borderBottom: `2px solid ${theme.input.highlightColor}`
    }
  }
})

const InlineInputRefForward: React.RefForwardingComponent<HTMLInputElement, InputProps> = (props, ref) => {
  return <InlineInputInner {...props} ref={ref} />
}
export const InlineInput = React.forwardRef(InlineInputRefForward)

export interface InputProps
  extends React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  > {
  label?: string
  textfieldWidth?: string
  editorInputWidth?: string
}
