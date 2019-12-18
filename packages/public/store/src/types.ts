/**
 * @module @edtr-io/store
 */
/** Comment needed because of https://github.com/christopherthielen/typedoc-plugin-external-module-name/issues/337 */
import { EditorPlugin } from '@edtr-io/internal__plugin'
import { Store as ReduxStore } from 'redux'

import { Action, Reversible } from './actions'

/**
 * Store state
 */
export type State = Record<string, ScopedState>
export type Store = ReduxStore<State, Action>

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

export interface DocumentState {
  plugin: string
  state?: unknown
}

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
// eslint-disable-next-line @typescript-eslint/no-explicit-any
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

export type ActionFromActionCreator<T extends ActionCreator> = ReturnType<
  ReturnType<T>
>

/**
 * Selectors
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Selector<T = any, P extends any[] = []> = (
  ...args: P
) => (scopedState: ScopedState) => T

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ReturnTypeFromSelector<T extends Selector<any, any>> = ReturnType<
  ReturnType<T>
>
