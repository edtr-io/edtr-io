import { ListsEditor } from '@prezly/slate-lists'
import { MouseEvent } from 'react'
import { Editor as SlateEditor, BaseEditor } from 'slate'
import { ReactEditor } from 'slate-react'

import { TextPluginConfig } from './config'

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
  onMouseDown(
    event: MouseEvent,
    control: TextEditorControl,
    index?: number
  ): void
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
  closeMenuTitle: string
  children: ControlButton[]
  isActive(editor: BaseEditor & ReactEditor & ListsEditor): boolean
  renderIcon(): React.ReactNode
  renderCloseMenuIcon(): React.ReactNode
}
