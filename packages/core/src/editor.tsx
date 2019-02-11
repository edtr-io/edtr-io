import * as React from 'react'

import { Document, DocumentIdentifier } from './document'
import { EditorContext } from './editor-context'
import { reducer } from './store'
import { Plugin } from './plugin'

export function Editor<K extends string = string>(props: EditorProps<K>) {
  const [state, dispatch] = React.useReducer(reducer, {
    ...props,
    documents: {}
  })

  return (
    <EditorContext.Provider
      value={{
        state,
        dispatch
      }}
    >
      <Document state={props.state} />
      {props.children}
    </EditorContext.Provider>
  )
}

export interface EditorProps<K extends string = string> {
  children?: React.ReactNode
  plugins: Record<K, Plugin>
  defaultPlugin: K
  state: DocumentIdentifier
}
