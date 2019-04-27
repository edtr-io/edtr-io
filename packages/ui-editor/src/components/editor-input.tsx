import * as React from 'react'

import { createEditorUiTheme, EditorThemeProps, styled } from '../theme'

export const createEditorInputTheme = createEditorUiTheme<EditorInputTheme>(
  theme => {
    return {
      color: theme.backgroundColor,
      backgroundColor: 'transparent',
      highlightColor: theme.primary.background
    }
  }
)

const EditorInputLabel = styled.label((props: EditorThemeProps) => {
  const theme = createEditorInputTheme('input', props.theme)

  return {
    color: theme.color
  }
})

const EditorInputLabelInner = styled.span({ width: '5%' })

const EditorInputInner = styled.input((props: EditorThemeProps) => {
  const theme = createEditorInputTheme('input', props.theme)

  return {
    backgroundColor: theme.backgroundColor,
    border: 'none',
    borderBottom: `2px solid ${theme.color}`,
    color: theme.color,
    '&:focus': {
      outline: 'none',
      borderBottom: `2px solid ${theme.highlightColor}`
    }
  }
})

export class EditorInput extends React.Component<EditorInputProps> {
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
      <EditorInputLabel>
        <EditorInputLabelInner>{label}</EditorInputLabelInner>
        <EditorInputInner {...props} ref={this.input} />
      </EditorInputLabel>
    )
  }
}

export interface EditorInputTheme {
  backgroundColor: string
  color: string
  highlightColor: string
}

export interface EditorInputProps
  extends React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  > {
  label?: string
}
