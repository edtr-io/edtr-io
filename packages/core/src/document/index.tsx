import * as React from 'react'

import { DocumentEditor } from './editor'
import { ScopeContext } from '../editor-context'
import { DocumentRenderer } from './renderer'

export const SubDocument = (props: DocumentProps) => {
  const { scope, editable } = React.useContext(ScopeContext)
  return editable ? (
    <DocumentEditor scope={scope} {...props} />
  ) : (
    <DocumentRenderer scope={scope} {...props} />
  )
}

export interface DocumentProps {
  id: string
  pluginProps?: Record<string, unknown>
}

export { insertNewText } from './editor'
