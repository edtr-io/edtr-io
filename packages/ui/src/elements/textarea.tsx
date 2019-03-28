import * as React from 'react'
import { defaultTheming, EditorTheming, styled } from '..'
import { ThemeProps } from 'styled-components'

const TextareaLabel = styled.label((props: ThemeProps<EditorTheming>) => ({
  color: props.theme.textColor,
  display: 'flex',
  flexDirection: 'row',
  margin: '20px auto 0px',
  justifyContent: 'space-between'
}))
TextareaLabel.defaultProps = { theme: defaultTheming }

const TextareaLabelInner = styled.span({ width: '20%' })

const TextareaInner = styled.textarea((props: ThemeProps<EditorTheming>) => ({
  backgroundColor: 'transparent',
  border: `2px solid ${props.theme.textColor}`,
  marginTop: '5px',
  borderRadius: '5px',
  color: props.theme.textColor,
  padding: '10px',
  resize: 'none',
  outline: 'none',
  minHeight: '100px',
  width: '75%',
  '&:focus': {
    border: `2px solid ${props.theme.highlightColor}`
  }
}))
TextareaInner.defaultProps = { theme: defaultTheming }

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
