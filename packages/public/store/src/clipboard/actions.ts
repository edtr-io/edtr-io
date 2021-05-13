import { createActionCreator } from '../helpers'
import {
  ActionCreatorAction,
  ActionCreatorWithPayload,
  DocumentState,
} from '../types'

/** @beta */
export const copy: ActionCreatorWithPayload<'Copy', string | null> =
  createActionCreator('Copy')
/** @public */
export interface CopyAction {
  type: 'Copy'
  payload: string | null
  scope: string
}

/** @internal */
export const pureCopy: ActionCreatorWithPayload<'PureCopy', DocumentState> =
  createActionCreator('PureCopy')
/** @internal */
export type PureCopyAction = ActionCreatorAction<typeof pureCopy>

/** @public */
export type ClipboardAction = CopyAction
/** @internal */
export type InternalClipboardAction = PureCopyAction
