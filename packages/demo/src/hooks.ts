import { selectors, useStore } from '@edtr-io/core'
import * as React from 'react'

export function useLogState(scope?: string) {
  const store = useStore(scope)
  return () => {
    const serialized = selectors.serializeRootDocument(store.getState())
    const stringified = JSON.stringify({
      state: JSON.stringify(serialized)
    })
    // eslint-disable-next-line no-console
    console.log(stringified.substr(9, stringified.length - 9 - 1))
  }
}

export function useEditable(initial?: boolean) {
  return React.useState(initial === undefined ? true : initial)
}
