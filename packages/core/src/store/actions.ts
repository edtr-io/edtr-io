import { ActionFromCreator, createAction } from './helpers'
import { EditorState } from './types'

import { ClipboardAction } from './clipboard/actions'
import { DocumentsAction } from './documents/actions'
import { FocusAction } from './focus/actions'
import { HistoryAction } from './history/actions'
import { RootAction } from './root/actions'

export const setPartialState = createAction<
  'SetPartialState',
  Partial<EditorState>
>('SetPartialState')
export type SetPartialState = ActionFromCreator<typeof setPartialState>

export type Action =
  | ClipboardAction
  | DocumentsAction
  | FocusAction
  | HistoryAction
  | RootAction
  | SetPartialState
