import * as R from 'ramda'
import { Action, setPartialState } from './actions'
import { EditorState, ScopeState } from './types'

import { clipboardReducer } from './clipboard/reducer'
import { documentsReducer } from './documents/reducer'
import { focusReducer } from './focus/reducer'
import { historyReducer } from './history/reducer'
import { pluginsReducer } from './plugins/reducer'
import { rootReducer } from './root/reducer'

export function reducer(
  state: EditorState | undefined,
  action: Action
): EditorState {
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
    return R.map(editorState => editorReducer(editorState, action), state)
  }

  const instanceState = state && state[action.scope]
  const reducedEditorState = editorReducer(instanceState, action)

  return {
    ...state,
    [action.scope]: reducedEditorState
  }
}

function editorReducer(scopeState: ScopeState | undefined, action: Action) {
  return {
    clipboard: clipboardReducer(action, scopeState),
    documents: documentsReducer(action, scopeState),
    focus: focusReducer(action, scopeState),
    history: historyReducer(action, scopeState),
    plugins: pluginsReducer(action, scopeState),
    root: rootReducer(action, scopeState)
  }
}
