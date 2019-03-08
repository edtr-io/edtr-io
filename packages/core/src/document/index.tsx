import * as React from 'react'

import { DocumentEditor, DocumentEditorProps } from './editor'

export const Document: React.FunctionComponent<DocumentProps> = props => {
  return <DocumentEditor {...props} />
}

export type DocumentProps = DocumentEditorProps
