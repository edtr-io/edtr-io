import {
  ActionFromCreator,
  createAction,
  createActionWithoutPayload
} from '../helpers'

export const persist = createActionWithoutPayload<'Persist'>('Persist')
export type PersistAction = ActionFromCreator<typeof persist>

export const reset = createActionWithoutPayload<'Reset'>('Reset')
export type ResetAction = ActionFromCreator<typeof reset>
export const pureReset = createActionWithoutPayload<'PureReset'>('PureReset')
export type PureResetAction = ActionFromCreator<typeof pureReset>

// Accepts an array of `Action`s as payload. This would lead to a reference cycle, though
export const commit = createAction<'Commit', unknown[]>('Commit')
export type CommitAction = ActionFromCreator<typeof commit>
export const pureCommit = createAction<
  'PureCommit',
  {
    combine: boolean
    actions: unknown[]
  }
>('PureCommit')
export type PureCommitAction = ActionFromCreator<typeof pureCommit>

export const undo = createActionWithoutPayload<'Undo'>('Undo')
export type UndoAction = ActionFromCreator<typeof undo>
export const pureUndo = createActionWithoutPayload<'PureUndo'>('PureUndo')
export type PureUndoAction = ActionFromCreator<typeof pureUndo>

export const redo = createActionWithoutPayload<'Redo'>('Redo')
export type RedoAction = ActionFromCreator<typeof redo>
export const pureRedo = createActionWithoutPayload<'PureRedo'>('PureRedo')
export type PureRedoAction = ActionFromCreator<typeof pureRedo>

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

export const publicHistoryActions = {
  persist,
  reset,
  undo,
  redo
}
