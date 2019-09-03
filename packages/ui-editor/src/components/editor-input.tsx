import {
  createEditorUiTheme,
  InputTheme,
  EditorThemeProps,
  styled
} from '@edtr-io/ui'
import * as React from 'react'

import { InputProps } from './overlay-input'

export const createEditorInputTheme = createEditorUiTheme<InputTheme>(theme => {
  return {
    color: theme.backgroundColor,
    backgroundColor: 'transparent',
    highlightColor: theme.primary.background
  }
})

const EditorInputLabel = styled.label(
  (props: EditorThemeProps & { width: string | undefined }) => {
    const theme = createEditorInputTheme('input', props.theme)

    return {
      width: props.width,
      color: theme.color
    }
  }
)

const EditorInputInner = styled.input(
  (props: EditorThemeProps & { textWidth: string | undefined }) => {
    const theme = createEditorInputTheme('input', props.theme)

    return {
      backgroundColor: theme.backgroundColor,
      border: 'none',
      width: props.textWidth,
      borderBottom: `2px solid ${theme.color}`,
      color: theme.color,
      paddingLeft: '10px',
      '&:focus': {
        outline: 'none',
        borderBottom: `2px solid ${theme.highlightColor}`
      }
    }
  }
)

export class EditorInput extends React.Component<InputProps> {
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
      <EditorInputLabel width={props.editorInputWidth}>
        {label}
        <EditorInputInner
          textWidth={props.textfieldWidth}
          {...props}
          ref={this.input}
        />
      </EditorInputLabel>
    )
  }
}
