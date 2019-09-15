/**
 * @module @edtr-io/store
 */
/** Comment needed because of https://github.com/christopherthielen/typedoc-plugin-external-module-name/issues/337 */
import { createAction, createActionWithoutPayload } from '../helpers'
import { ActionFromActionCreator } from '../types'

export const persist = createActionWithoutPayload<'Persist'>('Persist')
export type PersistAction = ActionFromActionCreator<typeof persist>

export const reset = createActionWithoutPayload<'Reset'>('Reset')
export type ResetAction = ActionFromActionCreator<typeof reset>
export const pureReset = createActionWithoutPayload<'PureReset'>('PureReset')
export type PureResetAction = ActionFromActionCreator<typeof pureReset>

// Accepts an array of `Action`s as payload. This would lead to a reference cycle, though
export const commit = createAction<'Commit', unknown[]>('Commit')
export type CommitAction = ActionFromActionCreator<typeof commit>
export const pureCommit = createAction<
  'PureCommit',
  {
    combine: boolean
    actions: unknown[]
  }
>('PureCommit')
export type PureCommitAction = ActionFromActionCreator<typeof pureCommit>

export const undo = createActionWithoutPayload<'Undo'>('Undo')
export type UndoAction = ActionFromActionCreator<typeof undo>
export const pureUndo = createActionWithoutPayload<'PureUndo'>('PureUndo')
export type PureUndoAction = ActionFromActionCreator<typeof pureUndo>

export const redo = createActionWithoutPayload<'Redo'>('Redo')
export type RedoAction = ActionFromActionCreator<typeof redo>
export const pureRedo = createActionWithoutPayload<'PureRedo'>('PureRedo')
export type PureRedoAction = ActionFromActionCreator<typeof pureRedo>

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
