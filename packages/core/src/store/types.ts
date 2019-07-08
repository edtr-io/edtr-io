import { Plugin } from '../plugin'

/**
 * Store state
 */
export type EditorState = Record<string, ScopeState>

export interface ScopeState {
  plugins: {
    defaultPlugin: string
    plugins: Record<string, Plugin>
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
    documents: ScopeState['documents']
  }
  undoStack: unknown[][]
  redoStack: unknown[][]
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

export type ScopedActionCreator<F = ActionCreator> = F extends (
  ...args: infer P
) => (scope: string) => infer A
  ? (...args: P) => A
  : never

export type UnscopedActionCreator<
  F = ScopedActionCreator<ActionCreator>
> = F extends ScopedActionCreator<ActionCreator<infer T>>
  ? (((...args: Parameters<F>) => (scope: string) => ReturnType<F>) & {
      type: T
    })
  : never
