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
    clipboard: clipboardReducer(action, state),
    documents: documentsReducer(action, state),
    focus: focusReducer(action, state),
    history: historyReducer(action, state),
    mode: modeReducer(action, state),
    plugins: pluginsReducer(action, state),
    root: rootReducer(action, state)
  }
}
