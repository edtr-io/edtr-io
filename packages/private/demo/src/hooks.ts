import { useScopedStore } from '@edtr-io/core'
import { serializeRootDocument, StoreEnhancerFactory } from '@edtr-io/store'
import { composeWithDevTools } from '@redux-devtools/extension'
import * as React from 'react'

export function useLogState(scope?: string) {
  const store = useScopedStore(scope)
  return () => {
    const serialized = serializeRootDocument()(store.getState())
    const stringified = JSON.stringify({
      state: JSON.stringify(serialized),
    })
    // eslint-disable-next-line no-console
    console.log(stringified.substr(9, stringified.length - 9 - 1))
  }
}

export function useEditable(initial?: boolean) {
  return React.useState(initial === undefined ? true : initial)
}

export function useReduxDevtools() {
  const createStoreDevtoolsEnhancer: StoreEnhancerFactory = (
    defaultEnhancer
  ) => {
    const composeEnhancers =
      window['__REDUX_DEVTOOLS_EXTENSION_COMPOSE__'] || composeWithDevTools

    return composeEnhancers(defaultEnhancer)
  }

  return {
    createStoreDevtoolsEnhancer,
  }
}
