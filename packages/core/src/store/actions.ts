import { StoreDeserializeHelpers } from '../plugin-state'
import { ActionCommitType } from '@edtr-io/core'
import { PluginState, PluginType } from '../plugin'

export enum ActionType {
  InitRoot = 'InitRoot',
  Insert = 'Insert',
  Remove = 'Remove',
  Change = 'Change',
  Focus = 'Focus',
  FocusNext = 'FocusNext',
  FocusPrevious = 'FocusPrevious',
  Undo = 'Undo',
  Redo = 'Redo',
  Persist = 'Persist',
  Reset = 'Reset',
  CopyToClipboard = 'CopyToClipboard',
  SwitchEditable = 'SwitchEditable',

  AsyncInsert = 'AsyncInsert'
}

export type Undoable = (InsertAction | ChangeAction | RemoveAction) & {
  commit?: ActionCommitType
}
export type Action =
  | InitRootAction
  | Undoable
  | FocusAction
  | FocusNextAction
  | FocusPreviousAction
  | UndoAction
  | RedoAction
  | PersistAction
  | ResetAction
  | CopyAction
  | SwitchEditableAction

export interface InitRootAction {
  type: ActionType.InitRoot
  payload: {
    plugin?: string
    state?: unknown
  }
}

export interface InsertAction {
  type: ActionType.Insert
  payload: {
    id: string
  } & Partial<PluginState>
}

export interface AsyncInsertAction {
  type: ActionType.AsyncInsert
  payload: {
    id: string
    plugin: PluginType
    tempState?: unknown
    state?: Promise<unknown>
  }
}

export interface ChangeAction<S = unknown> {
  type: ActionType.Change
  payload: {
    id: string
    state: (value: S, helpers: StoreDeserializeHelpers) => S
  }
}

export interface RemoveAction {
  type: ActionType.Remove
  payload: string
}

export interface FocusAction {
  type: ActionType.Focus
  payload: string
}

export interface FocusNextAction {
  type: ActionType.FocusNext
}

export interface FocusPreviousAction {
  type: ActionType.FocusPrevious
}

export interface UndoAction {
  type: ActionType.Undo
}

export interface RedoAction {
  type: ActionType.Redo
}

export interface PersistAction {
  type: ActionType.Persist
}

export interface ResetAction {
  type: ActionType.Reset
}

export interface CopyAction {
  type: ActionType.CopyToClipboard
  payload: string
}

export interface SwitchEditableAction {
  type: ActionType.SwitchEditable
  payload: boolean
}
