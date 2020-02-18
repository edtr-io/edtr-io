import * as InternalDocumentEditor from '@edtr-io/internal__document-editor/beta'
import * as React from 'react'

/** @public */
export const DocumentEditorContext = React.createContext<
  React.ComponentType<DocumentEditorProps>
>(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  undefined as any
)
/** @public */
export type DocumentEditorProps = InternalDocumentEditor.DocumentEditorProps
