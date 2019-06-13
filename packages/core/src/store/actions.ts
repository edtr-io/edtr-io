import { createAction } from './helpers'
import { State } from './types'

import { ClipboardAction } from './clipboard/actions'
import { DocumentsAction } from './documents/actions'
import { FocusAction } from './focus/actions'
import { HistoryAction } from './history/actions'
import { ModeAction } from './mode/actions'
import { RootAction } from './root/actions'

export const setPartialState = createAction<'SetPartialState', Partial<State>>(
  'SetPartialState'
)
export type SetPartialState = ReturnType<typeof setPartialState>

export type Action =
  | ClipboardAction
  | DocumentsAction
  | FocusAction
  | HistoryAction
  | ModeAction
  | RootAction
  | SetPartialState
