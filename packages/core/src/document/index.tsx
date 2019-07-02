import * as React from 'react'

import { DocumentEditor } from './editor'
import { DocumentRenderer } from './renderer'
import { EditableContext } from '../editor-context'

export const Document = (props: DocumentProps) => {
  const editable = React.useContext(EditableContext)
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
