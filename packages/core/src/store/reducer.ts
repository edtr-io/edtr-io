import { Action, setPartialState } from './actions'
import { State } from './types'

import { clipboardReducer } from './clipboard/reducer'
import { documentsReducer } from './documents/reducer'
import { focusReducer } from './focus/reducer'
import { historyReducer } from './history/reducer'
import { modeReducer } from './mode/reducer'
import { pluginsReducer } from './plugins/reducer'
import { rootReducer } from './root/reducer'

export function reducer(state: State | undefined, action: Action) {
  if (state && action.type === setPartialState.type) {
    return {
      ...state,
      ...action.payload
    }
  }

  return {
    clipboard: clipboardReducer(state && state.clipboard, action, state),
    documents: documentsReducer(state && state.documents, action, state),
    focus: focusReducer(state && state.focus, action, state),
    history: historyReducer(state && state.history, action, state),
    mode: modeReducer(state && state.mode, action, state),
    plugins: pluginsReducer(state && state.plugins, action, state),
    root: rootReducer(state && state.root, action, state)
  }
}
