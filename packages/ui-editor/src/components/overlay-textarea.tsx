import {
  createEditorUiTheme,
  EditorThemeProps,
  styled,
  TextareaTheme
} from '@edtr-io/ui'
import * as React from 'react'

import { createOverlayTheme } from './settings-overlay'

export const createOverlayTextareaTheme = createEditorUiTheme<TextareaTheme>(
  theme => {
    return {
      backgroundColor: 'transparent',
      color: theme.color,
      borderColor: theme.color,
      highlightColor: theme.primary.background
    }
  }
)
const TextareaLabel = styled.label<EditorThemeProps>(props => {
  const theme = createOverlayTheme(props.theme)

  return {
    color: theme.textarea.color,
    display: 'flex',
    flexDirection: 'row',
    margin: '20px auto 0',
    justifyContent: 'space-between'
  }
})

const TextareaLabelInner = styled.span({ width: '20%' })

const TextareaInner = styled.textarea<EditorThemeProps>(props => {
  const theme = createOverlayTheme(props.theme)

  return {
    backgroundColor: theme.textarea.backgroundColor,
    border: `2px solid ${theme.textarea.borderColor}`,
    marginTop: '5px',
    borderRadius: '5px',
    color: theme.textarea.color,
    padding: '10px',
    resize: 'none',
    outline: 'none',
    minHeight: '100px',
    width: '75%',
    '&:focus': {
      border: `2px solid ${theme.textarea.highlightColor}`
    }
  }
})

export class Textarea extends React.Component<TextareaProps> {
  private textarea = React.createRef<HTMLTextAreaElement>()

  public focus() {
    const textarea = this.textarea.current

    if (textarea) {
      setTimeout(() => {
        textarea.blur()
        textarea.focus()
      })
    }
  }

  public getTextareaRef(): HTMLTextAreaElement | null {
    return this.textarea.current
  }

  public render() {
    const { label, ...props } = this.props
    return (
      <TextareaLabel>
        <TextareaLabelInner>{label}</TextareaLabelInner>
        <TextareaInner {...props} ref={this.textarea} />
      </TextareaLabel>
    )
  }
}

export interface TextareaProps
  extends React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLTextAreaElement>,
    HTMLTextAreaElement
  > {
  label?: string
}
