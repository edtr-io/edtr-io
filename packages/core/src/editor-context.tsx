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
      redoStack: [],
      pending: 0
    },
    clipboard: []
  },
  dispatch: () => {},
  editable: true
})

export interface EditorContextValue {
  state: State
  dispatch: (action: Action) => void
  editable: boolean
}
