import { Action as ReduxAction } from 'redux'

import { ClipboardAction } from './clipboard/actions'
import { DocumentsAction } from './documents/actions'
import { FocusAction } from './focus/actions'
import { createAction } from './helpers'
import { HistoryAction } from './history/actions'
import { RootAction } from './root/actions'
import { ActionFromActionCreator, ScopedState } from './types'

/** @public */
export const setPartialState = createAction<
  'SetPartialState',
  Partial<ScopedState>
>('SetPartialState')
/** @public */
export type SetPartialState = ActionFromActionCreator<typeof setPartialState>

/** @public */
export type Action =
  | ClipboardAction
  | DocumentsAction
  | FocusAction
  | HistoryAction
  | RootAction
  | SetPartialState

/** @public */
export interface Reversible<A = ReduxAction, R = ReduxAction> {
  action: A
  reverse: R
}

/** @public */
export type ReversibleAction<
  A extends Action = Action,
  R extends Action = Action
> = Reversible<A, R>
