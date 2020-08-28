import * as React from 'react'

// Scaffolding implementation of a preference context
// Useful for settings across one editor instance
// Basically a key-value store, no persistent yet

/** @beta */
export interface Preference {
  getKey: (key: string) => unknown
  setKey: (key: string, val: unknown) => void
}

/** @beta */
export const PreferenceContext = React.createContext<Preference>({
  getKey: () => {},
  setKey: () => {},
})

const store: { [key: string]: unknown } = {}

/**
 * Sets a preference
 *
 * @param key - The preference
 * @param val - The value
 * @beta
 */
export function setDefaultPreference(key: string, val: unknown) {
  store[key] = val
}

export function PreferenceContextProvider({
  children,
}: {
  children: React.ReactNode
}) {
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
      {children}
    </PreferenceContext.Provider>
  )
}
