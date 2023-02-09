import { ListsEditor } from '@prezly/slate-lists'
import { BaseEditor } from 'slate'
import { ReactEditor } from 'slate-react'

import { TextPluginConfig } from './config'

export interface HoveringToolbarProps {
  closeSubMenuIcon: React.ReactNode
  closeSubMenuTitle: string
  config: TextPluginConfig
}

export type TextEditorControl = ControlButton | NestedControlButton

export interface ControlButton {
  title: string
  isActive(editor: BaseEditor & ReactEditor & ListsEditor): boolean
  onClick(): void
  renderIcon(): React.ReactNode
}

export interface NestedControlButton {
  title: string
  children: ControlButton[]
  isActive(editor: BaseEditor & ReactEditor & ListsEditor): boolean
  renderIcon(): React.ReactNode
}
