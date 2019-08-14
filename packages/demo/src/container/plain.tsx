import {
  Editor,
  EditorProps,
  useEditorFocus,
  useEditorHistory
} from '@edtr-io/core'
import { Renderer, RendererProps } from '@edtr-io/renderer'
import * as React from 'react'

import { useLogState } from '../hooks'

export function PlainRendererContainer(props: RendererProps) {
  return <Renderer {...props} />
}

export function PlainEditorContainer(props: EditorProps) {
  const children = React.useCallback(
    document => {
      return (
        <PlainEditorContainerInner editable={props.editable}>
          {document}
        </PlainEditorContainerInner>
      )
    },
    [props.editable]
  )

  return <Editor {...props}>{children}</Editor>
}

function PlainEditorContainerInner(props: {
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
