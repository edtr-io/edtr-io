import { styled, useEditorUiTheme } from '@edtr-io/ui'
import * as React from 'react'

function useEditorInputTheme() {
  return useEditorUiTheme('input', (theme) => {
    return {
      color: theme.backgroundColor,
      backgroundColor: 'transparent',
      highlightColor: theme.primary.background,
    }
  })
}

const Label = styled.label<{ width: string | undefined }>(({ width }) => {
  const theme = useEditorInputTheme()
  return {
    width,
    color: theme.color,
  }
})

const Input = styled.input<{ textWidth: string | undefined }>(
  ({ textWidth }) => {
    const theme = useEditorInputTheme()
    return {
      backgroundColor: theme.backgroundColor,
      border: 'none',
      width: textWidth,
      borderBottom: `2px solid ${theme.color}`,
      color: theme.color,
      paddingLeft: '10px',
      '&:focus': {
        outline: 'none',
        borderBottom: `2px solid ${theme.highlightColor}`,
      },
    }
  }
)

/** @public */
export const EditorInput = React.forwardRef<HTMLInputElement, EditorInputProps>(
  function EditorInput({ label, ...props }, ref) {
    return (
      <Label width={props.width}>
        {label ? `${label}:` : ''}
        <Input textWidth={props.inputWidth} {...props} ref={ref} />
      </Label>
    )
  }
)

/** @public */
export interface EditorInputProps
  extends React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  > {
  label?: string
  inputWidth?: string
  width?: string
}
