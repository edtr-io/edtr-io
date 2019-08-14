import { ClipboardAction } from './clipboard/actions'
import { DocumentsAction } from './documents/actions'
import { FocusAction } from './focus/actions'
import { createAction } from './helpers'
import { HistoryAction } from './history/actions'
import { RootAction } from './root/actions'
import { ActionFromActionCreator, ScopeState } from './types'

export const setPartialState = createAction<
  'SetPartialState',
  Partial<ScopeState>
>('SetPartialState')
export type SetPartialState = ActionFromActionCreator<typeof setPartialState>

export type Action =
  | ClipboardAction
  | DocumentsAction
  | FocusAction
  | HistoryAction
  | RootAction
  | SetPartialState
