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
const InputInlineInner = styled.input((props: EditorThemeProps) => {
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

export class InlineInput extends React.Component<InputProps> {
  private input = React.createRef<HTMLInputElement>()

  public focus() {
    const input = this.input.current
    if (input) {
      input.focus()
    }
  }

  public render() {
    return <InputInlineInner {...this.props} ref={this.input} />
  }
}

export class OverlayInput extends React.Component<InputProps> {
  private input = React.createRef<HTMLInputElement>()

  public focus() {
    const input = this.input.current
    if (input) {
      input.focus()
    }
  }

  public render() {
    const { label, ...props } = this.props
    return (
      <InputLabel>
        <InputLabelInner>{label}</InputLabelInner>
        <InputInner {...props} ref={this.input} />
      </InputLabel>
    )
  }
}

export class AutoFocusInput extends React.Component<InputProps> {
  public render() {
    return (
      <OverlayInput
        {...this.props}
        //@ts-ignore FIXME
        ref={(ref: Input | null) => {
          if (ref) {
            ref.focus()
          }
        }}
      />
    )
  }
}

export interface InputProps
  extends React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  > {
  label?: string
  textfieldWidth?: string
  editorInputWidth?: string
}
