import { useEditorFocus, useEditorHistory, useEditorMode } from '@edtr-io/core'
import * as React from 'react'

import { useLogState } from '../hooks'

export function PlainContainer({ children }: { children: React.ReactNode }) {
  const logState = useLogState()
  const { focusPrevious, focusNext } = useEditorFocus()
  const history = useEditorHistory()
  const [editable, setEditable] = useEditorMode()

  return (
    <React.Fragment>
      <div style={{ margin: '20px 0px' }}>{children}</div>
      <button onClick={logState}>Log State</button>
      <button onClick={history.undo}>Undo</button>
      <button onClick={history.redo}>Redo</button>
      <button onClick={history.persist} disabled={!history.hasPendingChanges}>
        Mark persisted
      </button>
      <button onClick={focusPrevious}>Focus Previous</button>
      <button onClick={focusNext}>FocusNext</button>
      <button
        onClick={() => {
          setEditable(!editable)
        }}
      >
        Switch to {editable ? 'render' : 'edit'} mode
      </button>
    </React.Fragment>
  )
}
