import { ListsEditor } from '@prezly/slate-lists'
import { MouseEventHandler } from 'react'
import { Editor as SlateEditor, BaseEditor } from 'slate'
import { ReactEditor } from 'slate-react'

import { TextPluginConfig } from '.'

export interface HoveringToolbarProps {
  config: TextPluginConfig
}

export interface HoveringToolbarControlsProps {
  editor: SlateEditor
  config: TextPluginConfig
}

export interface HoveringToolbarButtonProps {
  editor: SlateEditor
  config: TextPluginConfig
  index?: number
  control: TextEditorControl
  setSubMenu: React.Dispatch<React.SetStateAction<number | undefined>>
  onMouseDown: MouseEventHandler
}

export type TextEditorControl = ControlButton | NestedControlButton

export interface ControlButton {
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
