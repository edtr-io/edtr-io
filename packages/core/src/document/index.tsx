import * as React from 'react'

import { DocumentEditor } from './editor'
import { ScopeContext } from '../editor-context'
import { DocumentRenderer } from './renderer'

export const Document = (props: DocumentProps) => {
  const { editable } = React.useContext(ScopeContext)
  return editable ? (
    <DocumentEditor {...props} />
  ) : (
    <DocumentRenderer {...props} />
  )
}

export interface DocumentProps {
  scope: string
  id: string
  pluginProps?: Record<string, unknown>
  editable?: boolean
}
