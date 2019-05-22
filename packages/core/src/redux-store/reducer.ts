import { Action } from './actions'
import { State } from './types'

import { clipboardReducer } from './clipboard/reducer'
import { documentsReducer } from './documents/reducer'
import { focusReducer } from './focus/reducer'
import { modeReducer } from './mode/reducer'
import { pluginsReducer } from './plugins/reducer'
import { rootReducer } from './root/reducer'

export function reducer(state: State | undefined, action: Action) {
  return {
    clipboard: clipboardReducer(state && state.clipboard, action, state),
    documents: documentsReducer(state && state.documents, action, state),
    focus: focusReducer(state && state.focus, action, state),
    mode: modeReducer(state && state.mode, action, state),
    plugins: pluginsReducer(state && state.plugins, action, state),
    root: rootReducer(state && state.root, action, state)
  }
}
