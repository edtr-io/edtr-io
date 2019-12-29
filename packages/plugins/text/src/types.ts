import React from 'react'
import { ReactEditor, RenderElementProps, RenderLeafProps } from 'slate-react'

export interface Editor extends ReactEditor {
  controls: {
    title: string
    onClick(): void
  }[]

  onKeyDown(event: KeyboardEvent): void
  renderEditable(props: {
    children: React.ReactNode
    editable: boolean
  }): React.ReactNode
  renderElement(props: RenderElementProps): JSX.Element
  renderLeaf(props: RenderLeafProps): JSX.Element
}

export type TextEditorPlugin = (editor: Editor) => Editor
