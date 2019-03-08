import * as React from 'react'

import { Action, PluginState, State } from './store'

export const EditorContext = React.createContext<EditorContextValue>({
  state: {
    defaultPlugin: '',
    plugins: {},
    documents: {},
    history: {
      initialState: {
        defaultPlugin: '',
        plugins: {},
        documents: {}
      },
      actions: [],
      redoStack: [],
      pending: 0
    }
  },
  clipboard: {
    get: () => [],
    add: () => {}
  },
  dispatch: () => {}
})

export interface EditorContextValue {
  state: State
  clipboard: {
    get: () => PluginState[]
    add: (serialized: PluginState) => void
  }
  dispatch: (action: Action) => void
}
