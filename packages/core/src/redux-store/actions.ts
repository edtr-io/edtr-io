import { ClipboardAction } from './clipboard/actions'
import { DocumentsAction } from './documents/actions'
import { FocusAction } from './focus/actions'
import { ModeAction } from './mode/actions'
import { RootAction } from './root/actions'

export * from './clipboard/actions'
export * from './documents/actions'
export * from './focus/actions'
export * from './mode/actions'
export * from './root/actions'

export type Action =
  | ClipboardAction
  | DocumentsAction
  | FocusAction
  | ModeAction
  | RootAction
