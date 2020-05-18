import { ClipboardAction, InternalClipboardAction } from './clipboard/actions'
import { DocumentsAction, InternalDocumentsAction } from './documents/actions'
import { FocusAction } from './focus/actions'
import { createActionCreator } from './helpers'
import { HistoryAction, InternalHistoryAction } from './history/actions'
import { PluginAction } from './plugin/actions'
import { InternalRootAction, RootAction } from './root/actions'
import {
  ActionCreatorAction,
  ActionCreatorWithPayload,
  ScopedState,
} from './types'

/** @public */
export const setPartialState = createActionCreator<
  'SetPartialState',
  Partial<ScopedState>
>('SetPartialState')
/** @public */
export type SetPartialState = ActionCreatorAction<typeof setPartialState>

/** @internal */
export const applyActions: ActionCreatorWithPayload<
  'ApplyActions',
  InternalAction[]
> = createActionCreator('ApplyActions')
/** @internal */
export interface ApplyActionsAction {
  type: 'ApplyActions'
  payload: InternalAction[]
  scope: string
}

/** @public */
export type Action =
  | ClipboardAction
  | DocumentsAction
  | FocusAction
  | HistoryAction
  | PluginAction
  | RootAction
  | SetPartialState
/** @internal */
export type InternalAction =
  | Action
  | ApplyActionsAction
  | InternalClipboardAction
  | InternalDocumentsAction
  | InternalHistoryAction
  | InternalRootAction

/** @internal */
export interface ReversibleAction<
  A extends InternalAction = InternalAction,
  R extends InternalAction = InternalAction
> {
  action: A
  reverse: R
}
