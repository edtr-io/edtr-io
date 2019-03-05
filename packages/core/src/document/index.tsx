import * as React from 'react'

import { createDocument, DocumentEditor, DocumentIdentifier } from './editor'
import { SerializedDocument } from './renderer'

export { createDocument, DocumentIdentifier, SerializedDocument }

export const Document: React.FunctionComponent<DocumentProps> = ({ state }) => {
  return <DocumentEditor state={state} />
}

export interface DocumentProps {
  render?: (children: React.ReactNode) => React.ReactNode
  state: DocumentIdentifier
}
