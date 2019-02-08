import * as React from 'react'

import { Action, State } from './store'

export const EditorContext = React.createContext<EditorContextValue>({
  state: {
    defaultPlugin: '',
    plugins: {},
    documents: {}
  },
  dispatch: () => {}
})

export interface EditorContextValue {
  state: State
  dispatch: (action: Action) => void
}
