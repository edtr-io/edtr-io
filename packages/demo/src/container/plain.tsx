import {
  Editor,
  EditorProps,
  useEditorFocus,
  useEditorHistory
} from '@edtr-io/core'
import * as React from 'react'

import { useLogState } from '../hooks'

export function PlainContainer(props: EditorProps) {
  const children = React.useCallback(
    document => {
      return (
        <PlainContainerInner editable={props.editable}>
          {document}
        </PlainContainerInner>
      )
    },
    [props.editable]
  )

  return <Editor {...props}>{children}</Editor>
}

function PlainContainerInner(props: {
  children: React.ReactNode
  editable?: boolean
}) {
  const { focusPrevious, focusNext } = useEditorFocus()
  const history = useEditorHistory()
  const logState = useLogState()
  const [editable, setEditable] = React.useState(
    props.editable === undefined ? true : props.editable
  )

  return (
    <React.Fragment>
      <div style={{ margin: '20px 0' }}>{props.children}</div>
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
