import { DocumentEditorProps } from '@edtr-io/internal__document-editor'
import { undo } from '@edtr-io/store'
import * as React from 'react'

import { ScopeContext, ErrorContext, useScopedDispatch } from '../store'
import { DocumentEditor } from './editor'
import { DocumentRenderer } from './renderer'

// eslint-disable-next-line jsdoc/require-returns
/**
 * Renders a document inside another document
 *
 * @param props - The {@link DocumentProps}
 * @public
 */
export const SubDocument = (props: DocumentProps) => {
  const { editable } = React.useContext(ScopeContext)
  const dispatch = useScopedDispatch()
  const undoMemo = React.useCallback(() => {
    dispatch(undo())
  }, [dispatch])

  const Component = editable ? DocumentEditor : DocumentRenderer
  return (
    <ErrorBoundary undo={undoMemo}>
      <Component {...props} />
    </ErrorBoundary>
  )
}

export class ErrorBoundary extends React.Component<{ undo: () => void }> {
  static contextType = ErrorContext
  context!: React.ContextType<typeof ErrorContext>

  public state = { hasError: false }

  static getDerivedStateFromError() {
    // Update state so the next render will show the fallback UI.
    return { hasError: true }
  }

  public componentDidCatch(
    error: Error,
    errorInfo: { componentStack: string }
  ) {
    if (typeof this.context === 'function') {
      this.context(error, errorInfo)
    }
    console.log(error, errorInfo)
  }

  public render() {
    if (this.state.hasError) {
      return (
        <React.Fragment>
          Leider ist ein Fehler aufgetreten.
          <button
            onClick={() => {
              this.props.undo()
              this.setState({ hasError: false })
            }}
          >
            letzte Änderung rückgänging machen
          </button>
        </React.Fragment>
      )
    }

    return this.props.children
  }
}

/** @public */
export interface DocumentProps {
  id: string
  pluginProps?: {
    config?: {}
    insert?: DocumentEditorProps['insert']
    remove?: DocumentEditorProps['remove']
    renderSettings?: DocumentEditorProps['renderSettings']
    renderToolbar?: DocumentEditorProps['renderToolbar']
  }
}
