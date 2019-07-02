import * as R from 'ramda'
import { Action, setPartialState } from './actions'
import { EditorState, StoreState } from './types'

import { clipboardReducer } from './clipboard/reducer'
import { documentsReducer } from './documents/reducer'
import { focusReducer } from './focus/reducer'
import { historyReducer } from './history/reducer'
import { pluginsReducer } from './plugins/reducer'
import { rootReducer } from './root/reducer'

export function reducer(
  state: StoreState | undefined,
  action: Action
): StoreState {
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

function editorReducer(instanceState: EditorState | undefined, action: Action) {
  return {
    clipboard: clipboardReducer(action, instanceState),
    documents: documentsReducer(action, instanceState),
    focus: focusReducer(action, instanceState),
    history: historyReducer(action, instanceState),
    plugins: pluginsReducer(action, instanceState),
    root: rootReducer(action, instanceState)
  }
}
