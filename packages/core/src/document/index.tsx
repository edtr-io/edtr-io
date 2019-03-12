import * as React from 'react'

import { DocumentEditor } from './editor'
import { EditorContext } from '../editor-context'
import { DocumentRenderer } from './renderer'

export const Document: React.FunctionComponent<DocumentProps> = props => {
  const store = React.useContext(EditorContext)
  return store.editable ? (
    <DocumentEditor {...props} />
  ) : (
    <DocumentRenderer {...props} />
  )
}

export interface DocumentProps {
  id: string
}
