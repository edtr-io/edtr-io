import { ReactEditor, RenderElementProps, RenderLeafProps } from 'slate-react'

export interface Editor extends ReactEditor {
  onKeyDown(event: KeyboardEvent): void
  renderElement(props: RenderElementProps): JSX.Element
  renderLeaf(props: RenderLeafProps): JSX.Element
}

export type TextEditorPlugin = (editor: Editor) => Editor
