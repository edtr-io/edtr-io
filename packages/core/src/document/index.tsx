import * as React from 'react'

import { DocumentEditor } from './editor'
import { connectStateOnly } from '../editor-context'
import { DocumentRenderer } from './renderer'
import { selectors } from '../store'

export const Document = connectStateOnly<DocumentStateProps, DocumentProps>(
  state => {
    return {
      isEditable: selectors.isEditable(state)
    }
  }
)((props: DocumentProps & DocumentStateProps) => {
  const { isEditable } = props

  return isEditable ? (
    <DocumentEditor {...props} />
  ) : (
    <DocumentRenderer {...props} />
  )
})

export interface DocumentStateProps {
  isEditable: ReturnType<typeof selectors['isEditable']>
}

export interface DocumentProps {
  id: string
  pluginProps?: Record<string, unknown>
}
