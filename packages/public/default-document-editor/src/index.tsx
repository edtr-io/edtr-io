import { DocumentEditorProps } from '@edtr-io/document-editor/beta'
import {
  DeepPartial,
  edtrClose,
  EdtrIcon,
  faCog,
  Icon,
  styled
} from '@edtr-io/ui'
import * as R from 'ramda'
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

const BorderlessOverlayButton = styled.button({
  border: 'none !important',
  padding: '0 !important',
  minWidth: '0 !important'
})

/**
 * Creates the default {@link @edtr-io/document-editor#DocumentEditorProps | document editor}
 *
 * @param config - Configuration
 * @returns The default {@link @edtr-io/document-editor#DocumentEditorProps | document editor}
 * @beta
 */
export function createDefaultDocumentEditor(
  config: DefaultDocumentEditorConfig = {}
): React.ComponentType<DocumentEditorProps> {
  return function DocumentEditor({
    focused,
    children,
    renderSettings,
    renderToolbar,
    settingsRef,
    toolbarRef,
    hasSettings,
    hasToolbar,
    PluginToolbar
  }: DocumentEditorProps) {
    const { OverlayButton, PluginToolbarOverlayButton } = PluginToolbar

    const i18n = R.mergeDeepRight(
      {
        settings: {
          buttonLabel: 'Settings',
          modalTitle: 'Extended Settings',
          modalCloseLabel: 'Close'
        }
      },
      config.i18n || {}
    )

    const shouldShowSettings = showSettings()
    const renderSettingsContent = React.useMemo<typeof renderSettings>(() => {
      return shouldShowSettings
        ? (children, { close }) => {
            return (
              <React.Fragment>
                <Header>
                  <H4>{i18n.settings.modalTitle}</H4>
                  <BorderlessOverlayButton
                    as={OverlayButton}
                    onClick={() => {
                      close()
                    }}
                    label={i18n.settings.modalCloseLabel}
                  >
                    <EdtrIcon icon={edtrClose} />
                  </BorderlessOverlayButton>
                </Header>
                {renderSettings
                  ? renderSettings(children, { close })
                  : children}
              </React.Fragment>
            )
          }
        : undefined
    }, [OverlayButton, renderSettings, shouldShowSettings])
    const expanded = focused && (showSettings() || showToolbar())

    const appended = React.useRef(false)
    const toolbar = (
      <React.Fragment>
        {showSettings() ? (
          <PluginToolbarOverlayButton
            label={i18n.settings.buttonLabel}
            icon={<Icon icon={faCog} size="lg" />}
            renderContent={renderSettingsContent}
            contentRef={settingsRef}
          />
        ) : null}
        <div
          ref={ref => {
            // The ref `appended` ensures that we only append the content once so that we don't lose focus on every render
            if (ref && toolbarRef.current && !appended.current) {
              appended.current = true
              ref.appendChild(toolbarRef.current)
            } else if (!showSettings()) {
              appended.current = false
            }
          }}
        />
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
      return hasToolbar || renderToolbar !== undefined
    }
  }
}

/** @beta */
export interface DefaultDocumentEditorConfig {
  i18n?: DeepPartial<{
    modal: {
      title: string
      closeLabel: string
    }
  }>
}
