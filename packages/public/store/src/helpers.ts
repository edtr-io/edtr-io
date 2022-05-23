import * as R from 'ramda'
import { createSelectorCreator, defaultMemoize } from 'reselect'

import { Action, InternalAction } from './actions'
import {
  ScopedState,
  Selector,
  ActionCreatorWithPayload,
  ActionCreatorWithoutPayload,
  InternalScopedState,
  InternalSelector,
  InternalState,
} from './types'

export function createActionCreator<T, P>(
  type: T
): ActionCreatorWithPayload<T, P> {
  const actionCreator = (payload: P) => (scope: string) => {
    return {
      type,
      payload,
      scope,
    }
  }
  actionCreator.type = type

  return actionCreator
}

export function createActionWithoutPayload<T>(
  type: T
): ActionCreatorWithoutPayload<T> {
  const actionCreator = () => (scope: string) => {
    return { type, scope }
  }
  actionCreator.type = type

  return actionCreator
}

export function createSubReducer<K extends keyof InternalScopedState>(
  key: K,
  initialState: InternalScopedState[K],
  actionsMap: CaseReducersMapObject<InternalScopedState[K]>
): SubReducer<InternalScopedState[K]> {
  return (action, state) => {
    const subState = (state && state[key]) || initialState
    if (!state) return subState

    const caseReducer = actionsMap[action.type]
    return typeof caseReducer === 'function'
      ? caseReducer(subState, action, state)
      : subState
  }
}

/**
 * @param f - The selector
 * @public
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function createSelector<T, P extends any[]>(
  f: (state: ScopedState, ...args: P) => T
): Selector<T, P> {
  return (...args: P) =>
    (state: ScopedState) =>
      f(state, ...args)
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function createInternalSelector<T, P extends any[]>(
  f: (state: InternalScopedState, ...args: P) => T
): InternalSelector<T, P> {
  return (...args: P) =>
    (state: InternalScopedState) =>
      f(state, ...args)
}
const createDeepEqualSelectorCreator = createSelectorCreator(
  defaultMemoize,
  R.equals
)

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function createDeepEqualSelector<T, P extends any[]>(
  f: (state: ScopedState, ...args: P) => T
): Selector<T, P> {
  return (...args: P) => {
    return createDeepEqualSelectorCreator(
      (state: ScopedState) => {
        return f(state, ...args)
      },
      (s) => s
    )
  }
}

const createJsonStringifySelectorCreator = createSelectorCreator(
  defaultMemoize,
  (a, b) => JSON.stringify(a) === JSON.stringify(b)
)

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function createJsonStringifySelector<T, P extends any[]>(
  f: (state: ScopedState, ...args: P) => T
): Selector<T, P> {
  return (...args: P) => {
    return createJsonStringifySelectorCreator(
      (state: ScopedState) => {
        return f(state, ...args)
      },
      (s) => s
    )
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function scopeSelector<T, P extends any[]>(
  selector: Selector<T, P> | InternalSelector<T, P>,
  scope: string
) {
  return (storeState: InternalState, ...args: P) => {
    return selector(...args)(storeState[scope])
  }
}

/** @internal */
export type SubReducer<S = unknown> = (
  action: InternalAction,
  state: InternalScopedState | undefined
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
