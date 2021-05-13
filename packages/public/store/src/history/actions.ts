import { StateExecutor } from '@edtr-io/internal__plugin-state'

import { ReversibleAction } from '../actions'
import { createActionCreator, createActionWithoutPayload } from '../helpers'
import {
  ActionCreatorAction,
  ActionCreatorWithoutPayload,
  ActionCreatorWithPayload,
} from '../types'

/** @public */
export const persist = createActionWithoutPayload<'Persist'>('Persist')
/** @public */
export type PersistAction = ActionCreatorAction<typeof persist>

/** @public */
export const reset = createActionWithoutPayload<'Reset'>('Reset')
/** @public */
export type ResetAction = ActionCreatorAction<typeof reset>
/** @internal */
export const pureReset = createActionWithoutPayload<'PureReset'>('PureReset')
/** @internal */
export type PureResetAction = ActionCreatorAction<typeof pureReset>

/** @internal */
export const commit: ActionCreatorWithPayload<'Commit', ReversibleAction[]> =
  createActionCreator('Commit')
/** @internal */
export interface CommitAction {
  type: 'Commit'
  payload: ReversibleAction[]
  scope: string
}

/** @internal */
export const pureCommit: ActionCreatorWithPayload<
  'PureCommit',
  {
    combine: boolean
    actions: ReversibleAction[]
  }
> = createActionCreator('PureCommit')
/** @internal */
export interface PureCommitAction {
  type: 'PureCommit'
  payload: {
    combine: boolean
    actions: ReversibleAction[]
  }
  scope: string
}

/** @internal */
export const temporaryCommit: ActionCreatorWithPayload<
  'TemporaryCommit',
  {
    initial: ReversibleAction[]
    executor?: StateExecutor<ReversibleAction[]>
  }
> = createActionCreator('TemporaryCommit')
/** @internal */
export interface TemporaryCommitAction {
  type: 'TemporaryCommit'
  payload: {
    initial: ReversibleAction[]
    executor?: StateExecutor<ReversibleAction[]>
  }
  scope: string
}

/** @public */
export const undo: ActionCreatorWithoutPayload<'Undo'> =
  createActionWithoutPayload('Undo')
/** @public */
export type UndoAction = ActionCreatorAction<typeof undo>
/** @internal */
export const pureUndo: ActionCreatorWithoutPayload<'PureUndo'> =
  createActionWithoutPayload('PureUndo')
/** @internal */
export type PureUndoAction = ActionCreatorAction<typeof pureUndo>

/** @public */
export const redo: ActionCreatorWithoutPayload<'Redo'> =
  createActionWithoutPayload('Redo')
/** @public */
export type RedoAction = ActionCreatorAction<typeof redo>
/** @internal */
export const pureRedo: ActionCreatorWithoutPayload<'PureRedo'> =
  createActionWithoutPayload('PureRedo')
/** @internal */
export type PureRedoAction = ActionCreatorAction<typeof pureRedo>

/** @public */
export type HistoryAction =
  | PersistAction
  | ResetAction
  | UndoAction
  | RedoAction
/** @internal */
export type InternalHistoryAction =
  | PureResetAction
  | CommitAction
  | PureCommitAction
  | PureUndoAction
  | PureRedoAction
  | TemporaryCommitAction
