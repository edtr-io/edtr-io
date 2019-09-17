/**
 * @module @edtr-io/core
 */
/** Comment needed because of https://github.com/christopherthielen/typedoc-plugin-external-module-name/issues/337 */
import { DocumentEditorProps } from '@edtr-io/internal__document-editor'
import * as React from 'react'

/**
 * @ignore
 */
export const DocumentEditorContext = React.createContext<
  React.ComponentType<DocumentEditorProps>
>(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  undefined as any
)
