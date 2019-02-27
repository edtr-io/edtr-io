import * as React from 'react'

import { Action, State } from './store'

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
      redoStack: []
    }
  },
  dispatch: () => {}
})

export interface EditorContextValue {
  state: State
  dispatch: (action: Action) => void
}
