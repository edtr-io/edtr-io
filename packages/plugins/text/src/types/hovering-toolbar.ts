import { Editor as SlateEditor } from 'slate'

import type { TextEditorPlugin } from '.'

export type TextEditorControl = ControlButton | NestedControlButton

export interface ControlButton {
  plugin: TextEditorPlugin
  title: string
  isActive(editor: SlateEditor): boolean
  onClick(editor: SlateEditor): void
  renderIcon(editor: SlateEditor): React.ReactNode
}

export interface NestedControlButton {
  title: string
  closeMenuTitle: string
  children: ControlButton[]
  isActive(editor: SlateEditor): boolean
  renderIcon(editor: SlateEditor): React.ReactNode
  renderCloseMenuIcon(): React.ReactNode
}
