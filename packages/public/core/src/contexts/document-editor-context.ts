import { DocumentEditorProps } from '@edtr-io/internal__document-editor'
import * as React from 'react'

/** @public */
export const DocumentEditorContext = React.createContext<
  React.ComponentType<DocumentEditorProps>
>(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  undefined as any
)
