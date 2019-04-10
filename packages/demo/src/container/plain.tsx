import {
  State,
  useEditorFocus,
  useEditorHistory,
  useEditorMode
} from '@edtr-io/core'
import * as React from 'react'

import { useLogState } from '../hooks'
import { connect } from 'react-redux'

interface PlainContainerProps {
  state: State
}

const mapStateToProps = (state: State): PlainContainerProps => ({
  state: state
})

export const PlainContainer = connect(mapStateToProps)(PlainContainerConnector)

function PlainContainerConnector({
  children,
  state
}: { children: React.ReactNode } & PlainContainerProps) {
  const logState = useLogState(state)
  const { focusPrevious, focusNext } = useEditorFocus()
  const history = useEditorHistory()
  const [editable, setEditable] = useEditorMode()

  return (
    <React.Fragment>
      <div style={{ margin: '20px 0' }}>{children}</div>
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
