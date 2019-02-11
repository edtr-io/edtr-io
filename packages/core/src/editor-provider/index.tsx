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

export function EditorProvider<K extends string = string>(
  props: EditorProviderProps<K>
) {
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
  children?: React.ReactNode
  plugins: Record<K, Plugin>
  defaultPlugin: K
}
