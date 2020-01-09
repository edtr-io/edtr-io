import React from 'react'
import { ReactEditor, RenderElementProps, RenderLeafProps } from 'slate-react'

export interface TextConfig {
  placeholder: string
  plugins: TextEditorPlugin[]
  theme: {
    backgroundColor: string
    color: string
    hoverColor: string
    active: {
      backgroundColor: string
      color: string
    }
  }
}

export type TextEditorPlugin = (editor: Editor) => Editor

export interface Editor extends ReactEditor {
  controls: TextEditorControl[]

  onKeyDown(event: KeyboardEvent): void
  renderEditable(props: {
    children: React.ReactNode
    editable: boolean
  }): React.ReactNode
  renderElement(props: RenderElementProps): JSX.Element
  renderLeaf(props: RenderLeafProps): JSX.Element
}

export type TextEditorControl = ControlButton | NestedControlButton

export interface ControlButton {
  title: string
  isActive(): boolean
  onClick(): void
  renderIcon(): React.ReactNode
}

export interface NestedControlButton {
  title: string
  children: ControlButton[]
  renderIcon(): React.ReactNode
}

export function isNestedControlButton(
  control: TextEditorControl
): control is NestedControlButton {
  return (control as NestedControlButton).children !== undefined
}
