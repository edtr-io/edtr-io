import { serializeDocument, State } from '@edtr-io/core'

export function useLogState(state: State) {
  return () => {
    const serialized = serializeDocument(state)
    const stringified = JSON.stringify({
      state: JSON.stringify(serialized)
    })
    // eslint-disable-next-line no-console
    console.log(stringified.substr(9, stringified.length - 9 - 1))
  }
}
