import * as React from 'react'
import { v4 } from 'uuid'
import { PluginRegistry } from './plugin-registry'
import { createStateReducer, Reducer, StateAction } from './reducer'
import { Plugin } from '..'

export const EditorContext = React.createContext<EditorContextValue>({
  state: {},
  dispatch: () => {}
})

export interface EditorContextValue {
  state: Reducer
  dispatch: (action: StateAction) => void
}

export const EditorProvider: React.FunctionComponent<
  EditorProviderProps
> = props => {
  const reducer = React.useMemo(() => {
    return createStateReducer({
      defaultPlugin: props.defaultPlugin,
      registry: new PluginRegistry<string>(props.plugins),
      generateId: v4
    })
  }, [props.defaultPlugin, props.plugins])
  const [state, dispatch] = React.useReducer(reducer, {})

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
