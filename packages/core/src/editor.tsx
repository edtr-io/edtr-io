import * as React from 'react'
import { SettingOverlay, OverlayContext } from '@edtr-io/ui'
import { Document, DocumentIdentifier } from './document'
import { EditorContext } from './editor-context'
import { reducer } from './store'
import { Plugin } from './plugin'

export function Editor<K extends string = string>(props: EditorProps<K>) {
  const [state, dispatch] = React.useReducer(reducer, {
    ...props,
    documents: {}
  })

  const [showOverlay, setShowOverlay] = React.useState(false)

  return (
    <EditorContext.Provider
      value={{
        state,
        dispatch
      }}
    >
      <OverlayContext.Provider
        value={{
          showOverlay: () => {
            setShowOverlay(true)
          },
          hideOverlay: () => {
            setShowOverlay(false)
          }
        }}
      >
        {showOverlay ? <SettingOverlay /> : null}
        <Document state={props.state} />
        {props.children}
      </OverlayContext.Provider>
    </EditorContext.Provider>
  )
}

export interface EditorProps<K extends string = string> {
  children?: React.ReactNode
  plugins: Record<K, Plugin>
  defaultPlugin: K
  state: DocumentIdentifier
}
