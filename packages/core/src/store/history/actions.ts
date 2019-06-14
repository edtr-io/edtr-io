import { createAction, createActionWithoutPayload } from '../helpers'

export const persist = createActionWithoutPayload<'Persist'>('Persist')
export type PersistAction = ReturnType<typeof persist>

// TODO: handle this
export const reset = createActionWithoutPayload<'Reset'>('Reset')
export type ResetAction = ReturnType<typeof reset>

// Accepts an array of `Action`s as payload. This would lead to a reference cycle, though
export const commit = createAction<'Commit', unknown[]>('Commit')
export type CommitAction = ReturnType<typeof commit>
export const pureCommit = createAction<
  'PureCommit',
  {
    combine: boolean
    actions: unknown[]
  }
>('PureCommit')
export type PureCommitAction = ReturnType<typeof pureCommit>

export const undo = createActionWithoutPayload<'Undo'>('Undo')
export type UndoAction = ReturnType<typeof undo>
export const pureUndo = createActionWithoutPayload<'PureUndo'>('PureUndo')
export type PureUndoAction = ReturnType<typeof pureUndo>

export const redo = createActionWithoutPayload<'Redo'>('Redo')
export type RedoAction = ReturnType<typeof redo>
export const pureRedo = createActionWithoutPayload<'PureRedo'>('PureRedo')
export type PureRedoAction = ReturnType<typeof pureRedo>

export type HistoryAction =
  | PersistAction
  | ResetAction
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
