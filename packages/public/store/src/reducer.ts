import * as R from 'ramda'

import {
  Action,
  applyActions,
  ApplyActionsAction,
  setPartialState
} from './actions'
import { clipboardReducer } from './clipboard/reducer'
import { documentsReducer } from './documents/reducer'
import { focusReducer } from './focus/reducer'
import { createActionWithoutPayload } from './helpers'
import { historyReducer } from './history/reducer'
import { pluginsReducer } from './plugins/reducer'
import { rootReducer } from './root/reducer'
import { State, ScopedState } from './types'

/**
 * The Edtr.io root reducer
 *
 * @param state - The current {@link State | state} or `undefined`
 * @param action - The {@link Action | action} to dispatch
 * @returns The new {@link State | state}
 * @internal
 */
export function reducer(
  state: State = {},
  action: Action | ApplyActionsAction
): State {
  if (action.scope === undefined) {
    return R.map(State => scopedReducer(State, action as Action), state)
  }

  if (action.type === applyActions.type) {
    return R.reduce(reducer, state, action.payload)
  }

  if (action.type === setPartialState.type) {
    return {
      ...state,
      [action.scope]: {
        ...state[action.scope],
        ...action.payload
      }
    }
  }

  return {
    ...state,
    [action.scope]: scopedReducer(state[action.scope], action)
  }
}

function scopedReducer(scopeState: ScopedState | undefined, action: Action) {
  return {
    clipboard: clipboardReducer(action, scopeState),
    documents: documentsReducer(action, scopeState),
    focus: focusReducer(action, scopeState),
    history: historyReducer(action, scopeState),
    plugins: pluginsReducer(action, scopeState),
    root: rootReducer(action, scopeState)
  }
}

/**
 * Gets the {@link ScopedState | state} of a scope
 *
 * @param state - The current {@link State | state}
 * @param scope - The scope
 * @returns The {@link ScopedState | state} of the specified scope
 * @public
 */
export function getScope(state: State, scope: string): ScopedState {
  const scopedState = state[scope]
  if (!scopedState) {
    const fakeInitAction = createActionWithoutPayload('InitSubScope')()(scope)
    return reducer(state, (fakeInitAction as unknown) as Action)[scope]
  }
  return scopedState
}
