import { DocumentEditorProps } from '@edtr-io/document-editor/beta'
import {
  DeepPartial,
  edtrClose,
  EdtrIcon,
  faCog,
  Icon,
  merge,
  styled,
} from '@edtr-io/ui'
import * as React from 'react'

interface ToolbarProps {
  isFocused: boolean
  isHovered: boolean
}

interface ContainerProps {
  noHeight?: boolean
  isFocused?: boolean
  isHovered?: boolean
}

const ToolbarContent = styled.div<ToolbarProps>(({ isFocused, isHovered }) => ({
  backgroundColor: '#fff',
  borderRadius: '5px 0 0 5px',
  marginRight: '2px',
  paddingBottom: '10px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-end',
  opacity: isFocused ? 1 : isHovered ? 0.7 : 0,
  zIndex: 16,
  position: 'relative',
  transition: '250ms opacity ease-in-out',
}))

const ToolbarContainer = styled.div<ToolbarProps>(
  ({ isFocused, isHovered }) => ({
    position: 'absolute',
    top: 0,
    left: 0,
    transformOrigin: 'center top',
    transform: 'translateX(-100%)',
    pointerEvents: isFocused || isHovered ? 'all' : 'none',
    zIndex: isHovered ? '1' : 'auto',
    '&::before': {
      position: 'absolute',
      pointerEvents: 'none',
      top: 0,
      right: 0,
      content: '""',
      opacity: 1,
      height: '100%',
      width: '2px',
      zIndex: 15,
    },
  })
)

const Container = styled.div<ContainerProps>(
  ({ noHeight, isFocused, isHovered }: ContainerProps) => ({
    ...(!noHeight
      ? {
          minHeight: '10px',
          marginBottom: '25px',
        }
      : {}),
    position: 'relative',
    borderLeft: '2px solid transparent',
    paddingLeft: '5px',
    transition: '250ms all ease-in-out',

    ...(isFocused || isHovered
      ? {
          borderColor: isFocused ? '#333' : '#eee',
          paddingTop: 0,
          paddingBottom: 0,
        }
      : {}),

    ...(!isFocused && isHovered
      ? {
          [`&:hover:has(.default-document-editor-container:hover) > ${ToolbarContainer} > ${ToolbarContent}`]:
            {
              opacity: 0,
              borderColor: 'transparent',
            },
        }
      : {}),
  })
)

const Header = styled.div({
  display: 'flex',
  justifyContent: 'space-between',
})

const H4 = styled.h4({
  marginRight: '25px',
})

const BorderlessOverlayButton = styled.button({
  border: 'none !important',
  padding: '0 !important',
  minWidth: '0 !important',
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
    PluginToolbar,
  }: DocumentEditorProps) {
    const [hasHover, setHasHover] = React.useState(false)
    const { OverlayButton, PluginToolbarOverlayButton } = PluginToolbar

    const i18n = merge<DefaultDocumentEditorI18n>({
      fallback: {
        settings: {
          buttonLabel: 'Settings',
          modalTitle: 'Extended Settings',
          modalCloseLabel: 'Close',
        },
      },
      values: config.i18n || {},
    })
    const { modalTitle, modalCloseLabel } = i18n.settings

    const shouldShowSettings = showSettings()
    const renderSettingsContent = React.useMemo<typeof renderSettings>(() => {
      return shouldShowSettings
        ? (children, { close }) => (
            <React.Fragment>
              <Header>
                <H4>{modalTitle}</H4>
                <BorderlessOverlayButton
                  as={OverlayButton}
                  onClick={() => {
                    close()
                  }}
                  label={modalCloseLabel}
                >
                  <EdtrIcon icon={edtrClose} />
                </BorderlessOverlayButton>
              </Header>
              {renderSettings?.(children, { close }) || children}
            </React.Fragment>
          )
        : undefined
    }, [
      OverlayButton,
      renderSettings,
      shouldShowSettings,
      modalTitle,
      modalCloseLabel,
    ])
    const isFocused = focused && (showSettings() || showToolbar())
    const isHovered = hasHover && (showSettings() || showToolbar())

    const isAppended = React.useRef(false)
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
          ref={(ref) => {
            // The ref `isAppended` ensures that we only append the content once
            // so that we don't lose focus on every render
            if (ref && toolbarRef.current && !isAppended.current) {
              isAppended.current = true
              ref.appendChild(toolbarRef.current)
            } else if (!showSettings()) {
              isAppended.current = false
            }
          }}
        />
      </React.Fragment>
    )

    return (
      <Container
        className={
          isFocused || isHovered ? 'default-document-editor-container' : ''
        }
        isFocused={isFocused}
        isHovered={isHovered}
        onMouseEnter={() => setHasHover(true)}
        onMouseLeave={() => setHasHover(false)}
      >
        {children}
        <ToolbarContainer isFocused={isFocused} isHovered={isHovered}>
          <ToolbarContent isFocused={isFocused} isHovered={isHovered}>
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
            },
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
  i18n?: DeepPartial<DefaultDocumentEditorI18n>
}

/** @beta */
export interface DefaultDocumentEditorI18n {
  settings: {
    buttonLabel: string
    modalTitle: string
    modalCloseLabel: string
  }
}
