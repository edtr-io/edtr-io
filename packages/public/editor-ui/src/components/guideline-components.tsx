import {
  PluginToolbarOverlayButton,
  DocumentEditorContext
} from '@edtr-io/core'
import { styled, Icon, faQuestionCircle } from '@edtr-io/ui'
import * as React from 'react'
import { DocumentEditorProps } from '@edtr-io/document-editor'

const guidelineButtonLabel = 'Hilfe zum Bestandteil'

const StyledGuidelineButton = styled(PluginToolbarOverlayButton)({
  left: '-32px',
  position: 'absolute',
  top: '-25px'
})

export function GuidelineButton(props: { overlayContent: React.ReactNode }) {
  const contentRef = React.useRef<HTMLDivElement>(
    window.document.createElement('div')
  )
  return (
    <StyledGuidelineButton
      icon={<Icon icon={faQuestionCircle} size={'lg'} />}
      label={guidelineButtonLabel}
      renderContent={() => {
        return props.overlayContent
      }}
      contentRef={contentRef}
    />
  )
}

export function Guideline(
  props: React.PropsWithChildren<{ guideline: React.ReactNode }>
) {
  const DocumentEditorComponent = React.useContext(DocumentEditorContext)

  return (
    <DocumentEditorContext.Provider
      value={createGuideline(DocumentEditorComponent, props.guideline)}
    >
      {props.children}
    </DocumentEditorContext.Provider>
  )
}

function createGuideline(
  DocumentEditorComponent: React.ComponentType<DocumentEditorProps>,
  helptext: React.ReactNode
) {
  return function Guideline(props: DocumentEditorProps) {
    return (
      <React.Fragment>
        <DocumentEditorComponent {...props} />
        {props.focused ? <GuidelineButton overlayContent={helptext} /> : null}
      </React.Fragment>
    )
  }
}
