/**
 * @module @edtr-io/store
 */
/** Comment needed because of https://github.com/christopherthielen/typedoc-plugin-external-module-name/issues/337 */
import { Action } from './actions'
import { State, ScopedState, Selector } from './types'

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

export function createSubReducer<K extends keyof ScopedState>(
  key: K,
  initialState: ScopedState[K],
  actionsMap: CaseReducersMapObject<ScopedState[K]>
): SubReducer<ScopedState[K]> {
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
export function createSelector<T, P extends any[]>(
  f: (state: ScopedState, ...args: P) => T
): Selector<T, P> {
  return (...args: P) => (state: ScopedState) => f(state, ...args)
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function scopeSelector<T, P extends any[]>(
  selector: Selector<T, P>,
  scope: string
) {
  return (storeState: State, ...args: P) => {
    return selector(...args)(storeState[scope])
  }
}

export type SubReducer<S = unknown> = (
  action: Action,
  state: ScopedState | undefined
) => S

export interface CaseReducersMapObject<S = unknown> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [actionType: string]: CaseReducer<S, any>
}

export type CaseReducer<S = unknown, A extends Action = Action> = (
  subState: S,
  action: A,
  state: ScopedState
) => S
