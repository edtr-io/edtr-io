import { Action } from './actions'
import { EditorState } from './types'

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
