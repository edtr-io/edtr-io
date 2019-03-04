import * as R from 'ramda'
import * as React from 'react'

import { createDocument, DocumentEditor, DocumentIdentifier } from './editor'
import { SerializedDocument } from './renderer'

export { createDocument, DocumentIdentifier, SerializedDocument }

export const Document: React.FunctionComponent<DocumentProps> = ({
  render = R.identity,
  state
}) => {
  return <DocumentEditor render={render} state={state} />
}

export interface DocumentProps {
  render?: (children: React.ReactNode) => React.ReactNode
  state: DocumentIdentifier
}
