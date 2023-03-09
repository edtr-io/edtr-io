import { Editor as SlateEditor } from 'slate'

import type { TextEditorControl } from '.'

export type ControlButton = ActionControlButton | NestedControlButton

export interface ActionControlButton {
  name: TextEditorControl
  title: string
  isActive(editor: SlateEditor): boolean
  onClick(editor: SlateEditor): void
  renderIcon(editor: SlateEditor): React.ReactNode
}

export interface NestedControlButton {
  title: string
  closeMenuTitle: string
  children: ActionControlButton[]
  isActive(editor: SlateEditor): boolean
  renderIcon(editor: SlateEditor): React.ReactNode
  renderCloseMenuIcon(): React.ReactNode
}
