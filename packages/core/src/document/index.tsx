import * as React from 'react'

import {
  ScopeContext,
  connectDispatchOnly,
  ErrorContext
} from '../editor-context'
import { actions, ScopedActionCreator } from '../store'
import { DocumentEditor } from './editor'
import { DocumentRenderer } from './renderer'

export const SubDocument = (props: DocumentProps) => {
  const { scope, editable } = React.useContext(ScopeContext)
  return (
    <ErrorBoundary scope={scope}>
      {editable ? (
        <DocumentEditor scope={scope} {...props} />
      ) : (
        <DocumentRenderer scope={scope} {...props} />
      )}
    </ErrorBoundary>
  )
}

const ErrorBoundary = connectDispatchOnly<
  ErrorBoundaryDispatchProps,
  { scope: string }
>({
  undo: actions.undo
})(
  class ErrorBoundary extends React.Component<ErrorBoundaryDispatchProps> {
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
)

export interface DocumentProps {
  id: string
  pluginProps?: Record<string, unknown>
}

// Typescript somehow doesn't recognize an interface as Record<string, ..>
// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
type ErrorBoundaryDispatchProps = {
  undo: ScopedActionCreator<typeof actions['undo']>
}
