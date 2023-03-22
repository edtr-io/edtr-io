import { DeepPartial, styled } from '@edtr-io/ui'
import * as React from 'react'

import type { TextEditorPluginConfig } from '../types'

interface InputProps
  extends React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  > {
  theme: DeepPartial<TextEditorPluginConfig['theme']>
  label?: string
  textfieldWidth?: string
  editorInputWidth?: string
}

const InputInner = styled.input(({ theme }) => ({
  backgroundColor: theme.backgroundColor,
  border: 'none',
  borderBottom: `2px solid ${theme.color}`,
  color: theme.color,
  '&:focus': {
    outline: 'none',
    borderBottom: `2px solid ${theme.hoverColor}`,
  },
}))

const InputRefForward: React.ForwardRefRenderFunction<
  HTMLInputElement,
  InputProps
> = (props, ref) => {
  return <InputInner {...props} ref={ref} />
}

export const LinkControlsInput = React.forwardRef(InputRefForward)
