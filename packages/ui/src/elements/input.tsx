import * as React from 'react'
import { styled } from '..'

const InputLabel = styled.label({
  color: '#EEEEEE',
  margin: '20px auto 0px',
  padding: '0 10%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center'
})

const InputLabelInner = styled.span({ width: '10%' })

const InputInner = styled.input({
  backgroundColor: 'transparent',
  border: 'none',
  borderBottom: '2px solid #EEEEEE',
  color: '#EEEEEE',
  width: '60%',
  '&:focus': {
    outline: 'none',
    borderBottom: '2px solid #469BFF'
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
