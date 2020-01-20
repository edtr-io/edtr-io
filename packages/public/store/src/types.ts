import { EditorPlugin } from '@edtr-io/internal__plugin'
import { Store as ReduxStore } from 'redux'

import { Action, Reversible } from './actions'

/**
 * Store state
 */
/** @public */
export type State = Record<string, ScopedState>
/** @public */
export type Store = ReduxStore<State, Action>

/** @public */
export interface ScopedState {
  plugins: {
    defaultPlugin: string
    plugins: Record<string, EditorPlugin>
  }
  documents: Record<string, DocumentState>
  focus: string | null
  root: string | null
  clipboard: DocumentState[]
  history: HistoryState
}

/** @public */
export interface DocumentState {
  plugin: string
  state?: unknown
}

/** @public */
export interface HistoryState {
  initialState?: {
    documents: ScopedState['documents']
  }
  undoStack: Reversible[][]
  redoStack: Reversible[][]
  pendingChanges: number
}

/**
 * Action creators
 */
/* eslint-disable @typescript-eslint/no-explicit-any */
/** @public */
export type ActionCreator<T = string, P = any> =
  | {
      (payload: P): (
        scope: string
      ) => {
        type: T
        payload?: P
        scope: string
      }
      type: T
    }
  | {
      (): (
        scope: string
      ) => {
        type: T
        scope: string
      }
      type: T
    }

/** @public */
export type ActionFromActionCreator<T extends ActionCreator> = ReturnType<
  ReturnType<T>
>

/**
 * Selectors
 */
/** @public */
export type Selector<T = any, P extends any[] = []> = (
  ...args: P
) => (scopedState: ScopedState) => T

/** @public */
export type ReturnTypeFromSelector<T extends Selector<any, any>> = ReturnType<
  ReturnType<T>
>
/* eslint-enable @typescript-eslint/no-explicit-any */
