import { DocumentEditorProps } from '@edtr-io/document-editor'
import { edtrClose, EdtrIcon, faCog, Icon, styled } from '@edtr-io/ui'
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

const Header = styled.div({
  display: 'flex',
  justifyContent: 'space-between'
})

const H4 = styled.h4({
  marginRight: '25px'
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
    PluginToolbar
  }: DocumentEditorProps) {
    const { OverlayButton, PluginToolbarOverlayButton } = PluginToolbar
    const BorderlessOverlayButton = styled(OverlayButton)({
      border: 'none !important',
      padding: '0 !important',
      minWidth: '0 !important'
    })

    const renderSettingsContent = React.useMemo<typeof renderSettings>(() => {
      return renderSettings ? ( children, { close }) => {
        return (
          <React.Fragment>
            <Header>
              <H4>Erweiterte Einstellungen</H4>
              <BorderlessOverlayButton
                onClick={() => {
                  close()
                }}
                label="Schließen"
              >
                <EdtrIcon icon={edtrClose} />
              </BorderlessOverlayButton>
            </Header>
            {renderSettings(children, { close })}
          </React.Fragment>
        )
      } : undefined
    }, [renderSettings])
    const expanded = focused && (showSettings() || showToolbar())
    const toolbar = (
      <React.Fragment>
        {showSettings() ? (
          <PluginToolbarOverlayButton
            label="Einstellungen"
            icon={<Icon icon={faCog} size="lg" />}
            renderContent={renderSettingsContent}
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
