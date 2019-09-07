import {
  Editor,
  EditorProps,
  useScopedDispatch,
  useScopedSelector
} from '@edtr-io/core'
import { Renderer, RendererProps } from '@edtr-io/renderer'
import {
  focusNext,
  focusPrevious,
  persist,
  redo,
  reset,
  undo,
  hasPendingChanges as hasPendingChangesSelector
} from '@edtr-io/store'
import { createStoreDevtoolsEnhancer } from '@edtr-io/store-devtools'
import * as React from 'react'

import { useLogState } from '../hooks'

export function PlainRendererContainer(props: RendererProps) {
  return (
    <Renderer {...props} createStoreEnhancer={createStoreDevtoolsEnhancer} />
  )
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

  return (
    <Editor {...props} createStoreEnhancer={createStoreDevtoolsEnhancer}>
      {children}
    </Editor>
  )
}

function PlainEditorContainerInner(props: {
  children: React.ReactNode
  editable?: boolean
}) {
  const dispatch = useScopedDispatch()
  const hasPendingChanges = useScopedSelector(hasPendingChangesSelector())
  const logState = useLogState()
  const [editable, setEditable] = React.useState(
    props.editable === undefined ? true : props.editable
  )

  return (
    <React.Fragment>
      <div style={{ margin: '20px 0' }}>{props.children}</div>
      <button onClick={logState}>Log State</button>
      <button
        onClick={() => {
          dispatch(undo())
        }}
      >
        Undo
      </button>
      <button
        onClick={() => {
          dispatch(redo())
        }}
      >
        Redo
      </button>
      <button
        onClick={() => {
          dispatch(persist())
        }}
        disabled={!hasPendingChanges}
      >
        Mark persisted
      </button>
      <button
        onClick={() => {
          dispatch(reset())
        }}
        disabled={!hasPendingChanges}
      >
        Reset
      </button>
      <button
        onClick={() => {
          dispatch(focusPrevious())
        }}
      >
        Focus Previous
      </button>
      <button
        onClick={() => {
          dispatch(focusNext())
        }}
      >
        FocusNext
      </button>
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
