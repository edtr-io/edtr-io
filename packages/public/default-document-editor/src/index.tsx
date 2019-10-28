import { DocumentEditorProps } from '@edtr-io/document-editor'
import { faCog, Icon, styled } from '@edtr-io/ui'
import * as React from 'react'

const Container = styled.div<{
  editable: boolean
  noHeight?: boolean
  expanded?: boolean
}>(({ noHeight, expanded }: { noHeight?: boolean; expanded?: boolean }) => {
  return {
    ...(!noHeight
      ? {
          minHeight: '10px',
          marginBottom: '25px'
        }
      : {}),
    position: 'relative',
    borderLeft: '2px solid transparent',
    paddingLeft: '5px',
    transition: '250ms all ease-in-out',

    ...(expanded
      ? {
          borderColor: '#333333',
          paddingTop: 0,
          paddingBottom: 0
        }
      : {
          borderColor: 'transparent'
        })
  }
})

const ToolbarContainer = styled.div<{ expanded: boolean }>(({ expanded }) => {
  return {
    position: 'absolute',
    top: 0,
    left: 0,
    transformOrigin: 'center top',
    transform: 'translateX(-100%)',
    pointerEvents: expanded ? 'all' : 'none',
    '&::before': {
      position: 'absolute',
      pointerEvents: 'none',
      top: 0,
      right: 0,
      content: '""',
      opacity: 1,
      height: '100%',
      width: '2px',
      zIndex: 15
    }
  }
})

const ToolbarContent = styled.div<{ expanded: boolean }>(({ expanded }) => {
  return {
    paddingBottom: '10px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    opacity: expanded ? 1 : 0,
    zIndex: 16,
    position: 'relative',
    transition: '250ms all ease-in-out'
  }
})

export function createDefaultDocumentEditor(
  _config: DefaultDocumentEditorConfig = {}
): React.ComponentType<DocumentEditorProps> {
  return function DocumentEditor({
    focused,
    children,
    renderSettings,
    renderToolbar,
    settingsRef,
    hasSettings,
    PluginToolbarOverlayButton
  }: DocumentEditorProps) {
    const expanded = focused && (showSettings() || showToolbar())
    const toolbar = (
      <React.Fragment>
        {showSettings() ? (
          <PluginToolbarOverlayButton
            label="Einstellungen"
            icon={<Icon icon={faCog} size="lg" />}
            renderContent={renderSettings}
            contentRef={settingsRef}
          />
        ) : null}
      </React.Fragment>
    )

    return (
      <Container editable expanded={expanded}>
        {children}
        <ToolbarContainer expanded={expanded}>
          <ToolbarContent expanded={expanded}>
            {renderToolbar ? renderToolbar(toolbar) : toolbar}
          </ToolbarContent>
        </ToolbarContainer>
      </Container>
    )

    function showSettings(): boolean {
      return (
        hasSettings ||
        (renderSettings !== undefined &&
          renderSettings(null, {
            close() {
              // noop
            }
          }) !== null)
      )
    }

    function showToolbar(): boolean {
      return renderToolbar !== undefined
    }
  }
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface DefaultDocumentEditorConfig {}
