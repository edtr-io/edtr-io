import { Document, EditorProps, EditorProvider } from '@edtr-io/core/beta'
import * as React from 'react'

import { useEditable, useReduxDevtools } from '../hooks'
import { SerloEditorContainerInner, SerloRendererContainer } from './serlo'

export function SerloWithPreviewEditorContainer(props: EditorProps) {
  const scope = 'main'
  const [editable, setEditable] = useEditable(props.editable)

  const { createStoreDevtoolsEnhancer } = useReduxDevtools()

  return (
    <EditorProvider createStoreEnhancer={createStoreDevtoolsEnhancer}>
      <div
        style={{
          position: 'fixed',
          width: '20vw',
          right: '0',
          top: '0',
          overflow: 'hidden',
          height: '100vh',
          borderLeft: '4px solid black',
          backgroundColor: '#eee',
          zIndex: 999,
        }}
      >
        <div>
          <div
            style={{
              width: '850px',
              transformOrigin: 'left top 0px',
              transform: 'scale(0.22)',
              overflow: 'hidden',
            }}
          >
            <Document {...props} scope={scope} mirror />
          </div>
        </div>
      </div>
      <SerloEditorContainerInner editable={editable} setEditable={setEditable}>
        <Document {...props} scope={scope} editable={editable} />
      </SerloEditorContainerInner>
    </EditorProvider>
  )
}

export const SerloWithPreviewRendererContainer = SerloRendererContainer
