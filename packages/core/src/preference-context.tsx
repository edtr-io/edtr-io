import * as React from 'react'

// Scaffolding implementation of a preference context
// Useful for settings across one editor instance
// Basically a key-value store, no persistent yet

export interface Preference {
  getKey: (key: string) => any
  setKey: (key: string, val: any) => void
}

export const PreferenceContext = React.createContext<Preference>({
  getKey: () => {},
  setKey: () => {}
})

const store: { [key: string]: any } = {}

export function PreferenceContextProvider(props: React.PropsWithChildren<{}>) {
  const [state, setState] = React.useState(1)

  function setKey(key: string, val: any) {
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
