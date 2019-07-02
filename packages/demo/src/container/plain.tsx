import { useEditorFocus, useEditorHistory } from '@edtr-io/core'
import * as React from 'react'

import { useLogState } from '../hooks'

export function PlainContainer({
  children,
  editable,
  setEditable
}: PlainContainerProps) {
  const logState = useLogState()
  const { focusPrevious, focusNext } = useEditorFocus()
  const history = useEditorHistory()

  return (
    <React.Fragment>
      <div style={{ margin: '20px 0' }}>{children}</div>
      <button onClick={logState}>Log State</button>
      <button onClick={history.undo}>Undo</button>
      <button onClick={history.redo}>Redo</button>
      <button onClick={history.persist} disabled={!history.hasPendingChanges}>
        Mark persisted
      </button>
      <button onClick={history.reset} disabled={!history.hasPendingChanges}>
        Reset
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

export interface PlainContainerProps {
  children: React.ReactNode
  editable: boolean
  setEditable: React.Dispatch<React.SetStateAction<boolean>>
}
