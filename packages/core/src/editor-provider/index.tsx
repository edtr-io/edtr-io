import * as React from 'react'
import { v4 } from 'uuid'
import { PluginRegistry } from './plugin-registry'
import { createStateReducer, Reducer, StateAction } from './reducer'
import { Plugin } from '..'

export const EditorContext = React.createContext<EditorContextValue>({
  state: {},
  dispatch: () => {},
  registry: new PluginRegistry<string>({})
})

export interface EditorContextValue {
  state: Reducer
  dispatch: (action: StateAction) => void
  registry: PluginRegistry
}

export const EditorProvider: React.FunctionComponent<
  EditorProviderProps
> = props => {
  const registry = React.useMemo(
    () => new PluginRegistry<string>(props.plugins),
    [props.plugins]
  )
  const reducer = React.useMemo(() => {
    return createStateReducer({
      defaultPlugin: props.defaultPlugin,
      registry,
      generateId: v4
    })
  }, [props.defaultPlugin, registry])
  const [state, dispatch] = React.useReducer(reducer, {})

  return (
    <EditorContext.Provider
      value={{
        state,
        dispatch,
        registry
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
