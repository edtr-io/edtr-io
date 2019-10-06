/**
 * @module @edtr-io/core
 */
/** Comment needed because of https://github.com/christopherthielen/typedoc-plugin-external-module-name/issues/337 */
import * as React from 'react'

// Scaffolding implementation of a preference context
// Useful for settings across one editor instance
// Basically a key-value store, no persistent yet

export interface Preference {
  getKey: (key: string) => unknown
  setKey: (key: string, val: unknown) => void
}

export const PreferenceContext = React.createContext<Preference>({
  getKey: () => {},
  setKey: () => {}
})

const store: { [key: string]: unknown } = {}

export function setDefaultPreference(key: string, val: unknown) {
  store[key] = val
}

export function PreferenceContextProvider(props: React.PropsWithChildren<{}>) {
  const [state, setState] = React.useState(1)

  function setKey(key: string, val: unknown) {
    store[key] = val
    setState(state + 1)
  }

  function getKey(key: string) {
    return store[key]
  }

  return (
    <PreferenceContext.Provider value={{ setKey, getKey }}>
      {props.children}
    </PreferenceContext.Provider>
  )
}
