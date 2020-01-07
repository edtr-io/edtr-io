/**
 * @module @edtr-io/store
 */
/** Comment needed because of https://github.com/christopherthielen/typedoc-plugin-external-module-name/issues/337 */
import * as R from 'ramda'

import { Action, setPartialState } from './actions'
import { clipboardReducer } from './clipboard/reducer'
import { documentsReducer } from './documents/reducer'
import { focusReducer } from './focus/reducer'
import { createActionWithoutPayload } from './helpers'
import { historyReducer } from './history/reducer'
import { pluginsReducer } from './plugins/reducer'
import { rootReducer } from './root/reducer'
import { State, ScopedState } from './types'

export function reducer(state: State | undefined, action: Action): State {
  if (state && action.type === setPartialState.type) {
    return {
      ...state,
      [action.scope]: {
        ...state[action.scope],
        ...action.payload
      }
    }
  }

  // Handle init action of redux
  if (action.scope === undefined) {
    return R.map(State => scopedReducer(State, action), state)
  }

  const instanceState = state && state[action.scope]
  const reducedState = scopedReducer(instanceState, action)

  return {
    ...state,
    [action.scope]: reducedState
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

export function getScope(state: State, scope: string): ScopedState {
  const scopedState = state[scope]
  if (!scopedState) {
    const fakeInitAction = createActionWithoutPayload('InitSubScope')()(scope)
    return reducer(state, (fakeInitAction as unknown) as Action)[scope]
  }
  return scopedState
}
