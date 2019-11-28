/**
 * @module @edtr-io/store
 */
/** Comment needed because of https://github.com/christopherthielen/typedoc-plugin-external-module-name/issues/337 */
import { Reversible } from '../actions'
import { createAction, createActionWithoutPayload } from '../helpers'
import { ActionFromActionCreator } from '../types'

export const persist = createActionWithoutPayload<'Persist'>('Persist')
export type PersistAction = ActionFromActionCreator<typeof persist>

export const reset = createActionWithoutPayload<'Reset'>('Reset')
export type ResetAction = ActionFromActionCreator<typeof reset>
export const pureReset = createActionWithoutPayload<'PureReset'>('PureReset')
export type PureResetAction = ActionFromActionCreator<typeof pureReset>

// Actually accepts an array of `ReversibleAction`s as payload. This would lead to a reference cycle, though
export const commit = createAction<'Commit', Reversible[]>('Commit')
export type CommitAction = ActionFromActionCreator<typeof commit>
export const pureCommit = createAction<
  'PureCommit',
  {
    combine: boolean
    actions: Reversible[]
  }
>('PureCommit')
export type PureCommitAction = ActionFromActionCreator<typeof pureCommit>

export const tempCommit = createAction<'TempCommitAction', {
  resolver: (resolve: (actions: Reversible[]) => void, reject: Function, next: (actions: Reversible[]) => void) => void
  initialActions: Reversible[]
}>('TempCommitAction')
export type TempCommitAction = ActionFromActionCreator<typeof tempCommit>

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
  | TempCommitAction
