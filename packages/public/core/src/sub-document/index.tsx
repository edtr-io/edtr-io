import { PluginProps } from '@edtr-io/internal__plugin-state'
import { undo } from '@edtr-io/store'
import * as React from 'react'

import { ScopeContext, ErrorContext, useScopedDispatch } from '../store'
import { SubDocumentEditor } from './editor'
import { SubDocumentRenderer } from './renderer'

/**
 * Renders a document inside another document
 *
 * @param props - The {@link SubDocumentProps}
 * @public
 */
export const SubDocument = (props: SubDocumentProps) => {
  const { editable } = React.useContext(ScopeContext)
  const dispatch = useScopedDispatch()
  const undoMemo = React.useCallback(() => {
    dispatch(undo())
  }, [dispatch])

  const Component = editable ? SubDocumentEditor : SubDocumentRenderer
  return (
    <ErrorBoundary undo={undoMemo}>
      <Component {...props} />
    </ErrorBoundary>
  )
}

export class ErrorBoundary extends React.Component<{
  undo: () => void
  children: React.ReactNode
}> {
  static contextType = ErrorContext

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
export interface SubDocumentProps {
  id: string
  pluginProps?: PluginProps
}
