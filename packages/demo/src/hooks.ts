import { EditorContext, serializeDocument } from '@edtr-io/core'
import * as React from 'react'

export function useLogState() {
  const store = React.useContext(EditorContext)
  return () => {
    const serialized = serializeDocument(store.state)
    const stringified = JSON.stringify({
      state: JSON.stringify(serialized)
    })
    // eslint-disable-next-line no-console
    console.log(stringified.substr(9, stringified.length - 9 - 1))
  }
}
