import * as React from 'react'

import {
  createDocumentIdentifier,
  DocumentEditor,
  DocumentIdentifier
} from './editor'
import { DocumentRenderer, SerializedDocument } from './renderer'

export { createDocumentIdentifier, DocumentIdentifier, SerializedDocument }

export const Document: React.FunctionComponent<DocumentProps> = ({ state }) => {
  if (isDocumentIdentifier(state)) {
    return <DocumentEditor state={state} />
  }

  return <DocumentRenderer state={state} />
}

export interface DocumentProps {
  state: DocumentIdentifier | SerializedDocument
}

export function isDocumentIdentifier(
  state: DocumentProps['state']
): state is DocumentIdentifier {
  return (state as DocumentIdentifier).$$typeof !== undefined
}
