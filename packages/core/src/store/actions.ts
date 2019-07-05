import { createAction } from './helpers'
import { ActionFromActionCreator, ScopeState } from './types'

import { ClipboardAction } from './clipboard/actions'
import { DocumentsAction } from './documents/actions'
import { FocusAction } from './focus/actions'
import { HistoryAction } from './history/actions'
import { RootAction } from './root/actions'

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
