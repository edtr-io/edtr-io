import { Action } from './actions'
import { EditorState, ScopeState } from './types'

export function createAction<T, P>(type: T) {
  const actionCreator = (payload: P) => (scope: string) => {
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
  const actionCreator = () => (scope: string) => {
    return { type, scope }
  }
  actionCreator.type = type

  return actionCreator
}

export function createSubReducer<K extends keyof ScopeState>(
  key: K,
  initialState: ScopeState[K],
  actionsMap: CaseReducersMapObject<ScopeState[K]>
): SubReducer<ScopeState[K]> {
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
  selector: (state: ScopeState, ...args: P) => T,
  scope: string
) {
  return (storeState: EditorState, ...args: P) => {
    return selector(storeState[scope], ...args)
  }
}

export type SubReducer<S = unknown> = (
  action: Action,
  state: ScopeState | undefined
) => S

export interface CaseReducersMapObject<S = unknown> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [actionType: string]: CaseReducer<S, any>
}

export type CaseReducer<S = unknown, A extends Action = Action> = (
  subState: S,
  action: A,
  state: ScopeState
) => S
