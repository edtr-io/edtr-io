import * as React from 'react'
import { createUiElementTheme, EditorThemeProps, styled } from '@edtr-io/ui'

export const createTextareaTheme = createUiElementTheme<TextareaTheme>(
  theme => {
    return {
      backgroundColor: 'transparent',
      color: theme.color,
      borderColor: theme.color,
      highlightColor: theme.highlightColor
    }
  }
)
const TextareaLabel = styled.label((props: EditorThemeProps) => {
  const theme = createTextareaTheme('textarea', props.theme)

  return {
    color: theme.color,
    display: 'flex',
    flexDirection: 'row',
    margin: '20px auto 0px',
    justifyContent: 'space-between'
  }
})

const TextareaLabelInner = styled.span({ width: '20%' })

const TextareaInner = styled.textarea((props: EditorThemeProps) => {
  const theme = createTextareaTheme('textarea', props.theme)

  return {
    backgroundColor: theme.backgroundColor,
    border: `2px solid ${theme.color}`,
    marginTop: '5px',
    borderRadius: '5px',
    color: theme.color,
    padding: '10px',
    resize: 'none',
    outline: 'none',
    minHeight: '100px',
    width: '75%',
    '&:focus': {
      border: `2px solid ${theme.highlightColor}`
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

export interface TextareaTheme {
  backgroundColor: string
  color: string
  borderColor: string
  highlightColor: string
}
