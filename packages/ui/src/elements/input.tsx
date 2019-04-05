import * as React from 'react'

import { createUiElementTheme, EditorThemeProps, styled } from '..'

export const createInputTheme = createUiElementTheme<InputTheme>(theme => {
  return {
    backgroundColor: 'transparent',
    color: theme.color,
    highlightColor: theme.highlightColor
  }
})

const InputLabel = styled.label((props: EditorThemeProps) => {
  const theme = createInputTheme('input', props.theme)

  return {
    color: theme.color,
    margin: '20px auto 0px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  }
})

const InputLabelInner = styled.span({ width: '20%' })

const InputInner = styled.input((props: EditorThemeProps) => {
  const theme = createInputTheme('input', props.theme)

  return {
    backgroundColor: theme.backgroundColor,
    border: 'none',
    borderBottom: `2px solid ${theme.color}`,
    color: theme.color,
    width: '75%',
    '&:focus': {
      outline: 'none',
      borderBottom: `2px solid ${theme.highlightColor}`
    }
  }
})

export class Input extends React.Component<InputProps> {
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
      <Input
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

export interface InputTheme {
  backgroundColor: string
  color: string
  highlightColor: string
}

export interface InputProps
  extends React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  > {
  label?: string
}
