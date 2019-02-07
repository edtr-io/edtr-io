import * as React from 'react'

import { Action, reducer, State } from '../store'
import { Plugin } from '..'

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

export const EditorProvider: React.FunctionComponent<
  EditorProviderProps
> = props => {
  const [state, dispatch] = React.useReducer(reducer, {
    ...props,
    documents: {}
  })

  return (
    <EditorContext.Provider
      value={{
        state,
        dispatch
      }}
    >
      {props.children}
    </EditorContext.Provider>
  )
}

export interface EditorProviderProps<K extends string = string> {
  plugins: Record<K, Plugin>
  defaultPlugin: K
}
