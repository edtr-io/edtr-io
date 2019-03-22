import * as React from 'react'
import { defaultTheming, styled, EditorTheming } from '..'
import { ThemeProps } from 'styled-components'

const InputLabel = styled.label((props: ThemeProps<EditorTheming>) => ({
  color: props.theme.textColor,
  margin: '20px auto 0px',
  padding: '0 10%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center'
}))
InputLabel.defaultProps = {
  theme: defaultTheming
}

const InputLabelInner = styled.span({ width: '10%' })

const InputInner = styled.input((props: ThemeProps<EditorTheming>) => ({
  backgroundColor: 'transparent',
  border: 'none',
  borderBottom: `2px solid ${props.theme.textColor}`,
  color: props.theme.textColor,
  width: '60%',
  '&:focus': {
    outline: 'none',
    borderBottom: `2px solid ${props.theme.highlightColor}`
  }
}))
InputInner.defaultProps = {
  theme: defaultTheming
}

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
        //@ts-ignore FIXMEc
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
}
