/**
 * @module @edtr-io/store
 */
/** Comment needed because of https://github.com/christopherthielen/typedoc-plugin-external-module-name/issues/337 */
import { StateExecutor } from '@edtr-io/internal__plugin-state'

import { Reversible } from '../actions'
import { createAction, createActionWithoutPayload } from '../helpers'
import { ActionFromActionCreator } from '../types'

/** @public */
export const persist = createActionWithoutPayload<'Persist'>('Persist')
/** @public */
export type PersistAction = ActionFromActionCreator<typeof persist>

/** @public */
export const reset = createActionWithoutPayload<'Reset'>('Reset')
/** @public */
export type ResetAction = ActionFromActionCreator<typeof reset>
/** @public */
export const pureReset = createActionWithoutPayload<'PureReset'>('PureReset')
/** @public */
export type PureResetAction = ActionFromActionCreator<typeof pureReset>

// Actually accepts an array of `ReversibleAction`s as payload. This would lead to a reference cycle, though
/** @public */
export const commit = createAction<'Commit', Reversible[]>('Commit')
/** @public */
export type CommitAction = ActionFromActionCreator<typeof commit>
/** @public */
export const pureCommit = createAction<
  'PureCommit',
  {
    combine: boolean
    actions: Reversible[]
  }
>('PureCommit')
/** @public */
export type PureCommitAction = ActionFromActionCreator<typeof pureCommit>

/** @public */
export const temporaryCommit = createAction<
  'TemporaryCommit',
  {
    initial: Reversible[]
    executor?: StateExecutor<Reversible[]>
  }
>('TemporaryCommit')
/** @public */
export type TemporaryCommitAction = ActionFromActionCreator<
  typeof temporaryCommit
>

/** @public */
export const undo = createActionWithoutPayload<'Undo'>('Undo')
/** @public */
export type UndoAction = ActionFromActionCreator<typeof undo>
/** @public */
export const pureUndo = createActionWithoutPayload<'PureUndo'>('PureUndo')
/** @public */
export type PureUndoAction = ActionFromActionCreator<typeof pureUndo>

/** @public */
export const redo = createActionWithoutPayload<'Redo'>('Redo')
/** @public */
export type RedoAction = ActionFromActionCreator<typeof redo>
/** @public */
export const pureRedo = createActionWithoutPayload<'PureRedo'>('PureRedo')
/** @public */
export type PureRedoAction = ActionFromActionCreator<typeof pureRedo>

/** @public */
export type HistoryAction =
  | PersistAction
  | ResetAction
  | PureResetAction
  | CommitAction
  | PureCommitAction
  | UndoAction
  | PureUndoAction
  | RedoAction
  | PureRedoAction
  | TemporaryCommitAction
