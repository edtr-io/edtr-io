import { Document, EditorProps, EditorProvider } from '@edtr-io/core'
import * as React from 'react'

import { useEditable } from '../hooks'
import { SerloContainerInner } from './serlo'

export function SerloWithPreviewContainer(props: EditorProps) {
  const scope = 'main'
  const [editable, setEditable] = useEditable(props.editable)

  return (
    <EditorProvider>
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
          zIndex: 999
        }}
      >
        <div>
          <div
            style={{
              width: '850px',
              transformOrigin: 'left top 0px',
              transform: 'scale(0.22)',
              overflow: 'hidden'
            }}
          >
            <Document {...props} scope={scope} mirror />
          </div>
        </div>
      </div>
      <SerloContainerInner
        editable={editable}
        setEditable={setEditable}
        scope={scope}
      >
        <Document {...props} scope={scope} editable={editable} />
      </SerloContainerInner>
    </EditorProvider>
  )
}
