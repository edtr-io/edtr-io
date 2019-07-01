import { Action } from './actions'
import { EditorState, StoreState } from './types'

export type ActionCreator<T, P> =
  | {
      (scope: string): (
        payload: P
      ) => {
        type: T
        payload?: P
        scope: string
      }
      type: T
    }
  | {
      (scope: string): () => {
        type: T
        scope: string
      }
      type: T
    }
export function createAction<T, P>(type: T) {
  const actionCreator = (scope: string) => (payload: P) => {
    return {
      type,
      payload,
      scope
    }
  }
  actionCreator.type = type

  return actionCreator
}

export function createActionWithoutPayload<T>(type: T) {
  const actionCreator = (scope: string) => () => {
    return { type, scope }
  }
  actionCreator.type = type

  return actionCreator
}

export function createSubReducer<K extends keyof EditorState>(
  key: K,
  initialState: EditorState[K],
  actionsMap: CaseReducersMapObject<EditorState[K]>
): SubReducer<EditorState[K]> {
  return (action, state) => {
    const subState = (state && state[key]) || initialState
    if (!state) return subState

    const caseReducer = actionsMap[action.type]
    return typeof caseReducer === 'function'
      ? caseReducer(subState, action, state)
      : subState
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function scopeSelector<T, P extends any[]>(
  selector: (state: EditorState, ...args: P) => T,
  scope: string
) {
  return (storeState: StoreState, ...args: P) => {
    return selector(storeState[scope], ...args)
  }
}

export type SubReducer<S = unknown> = (
  action: Action,
  state: EditorState | undefined
) => S

export interface CaseReducersMapObject<S = unknown> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [actionType: string]: CaseReducer<S, any>
}

export type CaseReducer<S = unknown, A extends Action = Action> = (
  subState: S,
  action: A,
  state: EditorState
) => S

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ActionFromCreator<T extends ActionCreator<any, any>> = ReturnType<
  ReturnType<T>
>