import { selectors, useStore } from '@edtr-io/core'

export function useLogState() {
  const { store } = useStore()
  return () => {
    const serialized = selectors.serializeRootDocument(store.getState())
    const stringified = JSON.stringify({
      state: JSON.stringify(serialized)
    })
    // eslint-disable-next-line no-console
    console.log(stringified.substr(9, stringified.length - 9 - 1))
  }
}
