import { Action } from './actions'
import { State } from './types'

export function createAction<T, P>(type: T) {
  const actionCreator = (payload: P) => {
    return {
      type,
      payload
    }
  }
  actionCreator.type = type

  return actionCreator
}

export function createActionWithoutPayload<T>(type: T) {
  const actionCreator = () => {
    return { type }
  }
  actionCreator.type = type

  return actionCreator
}

export function createSubReducer<K extends keyof State>(
  key: K,
  initialState: State[K],
  actionsMap: CaseReducersMapObject<State[K]>
): SubReducer<State[K]> {
  return (subState = initialState, action, state) => {
    const caseReducer = actionsMap[action.type]
    return typeof caseReducer === 'function'
      ? caseReducer((state && state[key]) || initialState, action, state)
      : subState
  }
}

export type SubReducer<S = unknown> = (
  subState: S | undefined,
  action: Action,
  state: State | undefined
) => S

export interface CaseReducersMapObject<S = unknown> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [actionType: string]: CaseReducer<S, any>
}

export type CaseReducer<S = unknown, A extends Action = Action> = (
  subState: S,
  action: A,
  state: State | undefined
) => S
