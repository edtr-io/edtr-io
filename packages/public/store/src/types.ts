import { EditorPlugin } from '@edtr-io/internal__plugin'
import { Store as ReduxStore } from 'redux'

import { Action, InternalAction, ReversibleAction } from './actions'

/**
 * Store state
 */
/** @public */
export type State = Record<string, ScopedState>
/** @internal */
export type InternalState = Record<string, InternalScopedState>
/** @public */
export type Store = ReduxStore<State, Action>
/** @internal */
export type InternalStore = ReduxStore<InternalState, InternalAction>

/** @public */
export interface ScopedState {
  plugins: Record<string, EditorPlugin>
  documents: Record<string, DocumentState>
  focus: string | null
  root: string | null
  clipboard: DocumentState[]
  history: {
    undoStack: unknown[]
    redoStack: unknown[]
    pendingChanges: number
  }
}

/** @internal */
export interface InternalScopedState extends ScopedState {
  history: HistoryState
}

/** @public */
export interface DocumentState {
  plugin: string
  state: unknown
}

/** @internal */
export interface HistoryState {
  initialState?: {
    documents: ScopedState['documents']
  }
  undoStack: ReversibleAction[][]
  redoStack: ReversibleAction[][]
  pendingChanges: number
}

/**
 * Action creators
 */
/* eslint-disable @typescript-eslint/no-explicit-any */
/** @public */
export type ActionCreator<T = string, P = any> =
  | ActionCreatorWithoutPayload<T>
  | ActionCreatorWithPayload<T, P>
/** @public */
export interface ActionCreatorWithoutPayload<T = string> {
  (): (scope: string) => {
    type: T
    scope: string
  }
  type: T
}
/** @public */
export interface ActionCreatorWithPayload<T = string, P = any> {
  (payload: P): (scope: string) => {
    type: T
    payload: P
    scope: string
  }
  type: T
}
/** @public */
export type ActionCreatorAction<T extends ActionCreator> = ReturnType<
  ReturnType<T>
>

/**
 * Selectors
 */
/** @public */
export type Selector<T = any, P extends any[] = []> = (
  ...args: P
) => (scopedState: ScopedState) => T
/** @internal */
export type InternalSelector<T = any, P extends any[] = []> = (
  ...args: P
) => (scopedState: InternalScopedState) => T

/** @public */
export type SelectorReturnType<T extends Selector<any, any>> = ReturnType<
  ReturnType<T>
>
/** @internal */
export type InternalSelectorReturnType<T extends InternalSelector<any, any>> =
  ReturnType<ReturnType<T>>
/* eslint-enable @typescript-eslint/no-explicit-any */
