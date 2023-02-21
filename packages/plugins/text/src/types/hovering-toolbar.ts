import { ListsEditor } from '@prezly/slate-lists'
import { BaseEditor } from 'slate'
import { ReactEditor } from 'slate-react'

import type { TextEditorPlugin } from '.'

export type TextEditorControl = ControlButton | NestedControlButton

export interface ControlButton {
  plugin: TextEditorPlugin
  title: string
  isActive(editor: BaseEditor & ReactEditor & ListsEditor): boolean
  onClick(editor: BaseEditor & ReactEditor & ListsEditor): void
  renderIcon(): React.ReactNode
}

export interface NestedControlButton {
  title: string
  closeMenuTitle: string
  children: ControlButton[]
  isActive(editor: BaseEditor & ReactEditor & ListsEditor): boolean
  renderIcon(): React.ReactNode
  renderCloseMenuIcon(): React.ReactNode
}
