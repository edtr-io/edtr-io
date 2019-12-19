/**
 * @module @edtr-io/store
 */
/** Comment needed because of https://github.com/christopherthielen/typedoc-plugin-external-module-name/issues/337 */
import { Action as ReduxAction } from 'redux'

import { ClipboardAction } from './clipboard/actions'
import { DocumentsAction } from './documents/actions'
import { FocusAction } from './focus/actions'
import { createAction } from './helpers'
import { HistoryAction } from './history/actions'
import { RootAction } from './root/actions'
import { ActionFromActionCreator, ScopedState } from './types'

export const setPartialState = createAction<
  'SetPartialState',
  Partial<ScopedState>
>('SetPartialState')
export type SetPartialState = ActionFromActionCreator<typeof setPartialState>

export type Action =
  | ClipboardAction
  | DocumentsAction
  | FocusAction
  | HistoryAction
  | RootAction
  | SetPartialState

export interface Reversible<A = ReduxAction, R = ReduxAction> {
  action: A
  reverse: R
}

export type ReversibleAction<
  A extends Action = Action,
  R extends Action = Action
> = Reversible<A, R>
