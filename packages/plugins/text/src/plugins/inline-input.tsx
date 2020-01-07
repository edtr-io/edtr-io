import { styled } from '@edtr-io/ui'
import * as React from 'react'

const InlineInputInner = styled.input({
  backgroundColor: 'transparent',
  border: 'none',
  borderBottom: '2px solid #ffffff',
  color: '#ffffff',
  '&:focus': {
    outline: 'none',
    borderBottom: '2px solid rgb(70, 155, 255)'
  }
})

const InlineInputRefForward: React.RefForwardingComponent<
  HTMLInputElement,
  InputProps
> = (props, ref) => {
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
