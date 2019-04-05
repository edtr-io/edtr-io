import { OverlayContext } from '@edtr-io/core'
import * as React from 'react'
import { createPortal } from 'react-dom'
import { HotKeys } from 'react-hotkeys'

import {
  Icon,
  faTimes,
  faPencilAlt,
  faTrashAlt,
  faCog,
  createUiElementTheme,
  EditorThemeProps,
  styled
} from '..'
import { OnClickOutside } from '.'

export const createOverlayTheme = createUiElementTheme<OverlayTheme>(theme => {
  return {
    backgroundColor: theme.backgroundColor,
    color: theme.color,
    overlayBackgroundColor: '#00000033',
    highlightColor: theme.highlightColor
  }
})

const OverlayWrapper = styled.div((props: EditorThemeProps) => {
  const theme = createOverlayTheme('overlay', props.theme)

  return {
    width: '100%',
    height: '100%',
    position: 'fixed',
    top: 0,
    left: 0,
    overlayBackgroundColor: theme.overlayBackgroundColor,
    zIndex: 99
  }
})

export const OverlayBox = styled.div((props: EditorThemeProps) => {
  const theme = createOverlayTheme('overlay', props.theme)

  return {
    margin: '0 auto',
    position: 'absolute',
    zIndex: 100,
    backgroundColor: theme.backgroundColor,
    color: theme.color,
    left: '8%',
    right: '8%'
  }
})

const OverlaySettingsBox = styled(OverlayBox)({
  minHeight: '60%',
  paddingBottom: '10px',
  maxWidth: '1150px',
  top: '20%'
})

const CloseButton = styled.button((props: EditorThemeProps) => {
  const theme = createOverlayTheme('overlay', props.theme)

  return {
    float: 'right',
    position: 'relative',
    color: theme.color,
    fontSize: 16,
    zIndex: 98,
    outline: 'none',
    border: 'none',
    backgroundColor: 'transparent',
    paddingTop: '5px',
    '&:hover': {
      color: theme.highlightColor
    }
  }
})

const ContentWrapper = styled.div({
  padding: '20px 15%'
})

export function Overlay(props: {
  onClose?: () => void
  children?: React.ReactNode
}) {
  const overlayContext = React.useContext(OverlayContext)
  function closeHandler() {
    overlayContext.hide()
    if (props.onClose) {
      props.onClose()
    }
  }
  return overlayContext.node.current && overlayContext.visible
    ? createPortal(
        <HotKeys
          keyMap={{
            CLOSE: ['enter', 'esc']
          }}
          handlers={{
            CLOSE: closeHandler
          }}
        >
          <OverlayWrapper>
            <OnClickOutside onClick={closeHandler}>
              <OverlaySettingsBox>
                <CloseButton
                  onClick={closeHandler}
                  style={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    zIndex: 101
                  }}
                >
                  <Icon icon={faTimes} />
                </CloseButton>
                <ContentWrapper>{props.children}</ContentWrapper>
              </OverlaySettingsBox>
            </OnClickOutside>
          </OverlayWrapper>
        </HotKeys>,
        overlayContext.node.current
      )
    : null
}

const InlineOverlayWrapper = styled.div((props: EditorThemeProps) => {
  const theme = createOverlayTheme('overlay', props.theme)

  return {
    position: 'absolute',
    top: '-10000px',
    left: '-10000px',
    opacity: 0,
    transition: 'opacity 0.5s',
    backgroundColor: theme.backgroundColor,
    color: theme.color,
    padding: '5px',
    zIndex: 100,
    '& a': {
      color: theme.color,
      '&:hover': {
        color: theme.highlightColor
      }
    }
  }
})

const InlinePreview = styled.span({
  padding: '0px 8px'
})
const ChangeButton = styled.div((props: EditorThemeProps) => {
  const theme = createOverlayTheme('overlay', props.theme)

  return {
    padding: '5px 5px 5px 10px',
    display: 'inline-block',
    borderLeft: `2px solid ${theme.color}`,
    cursor: 'pointer',
    margin: '2px',
    '&:hover': {
      color: theme.highlightColor
    }
  }
})

export const InlineOverlay: React.FunctionComponent<{
  onEdit: React.MouseEventHandler
  onDelete: React.MouseEventHandler
}> = props => {
  const overlay = React.createRef<HTMLDivElement>()
  React.useEffect(() => {
    const menu = overlay.current
    if (!menu) return

    const native = window.getSelection()
    const range = native.getRangeAt(0)
    const rect = range.getBoundingClientRect()
    if (rect.height === 0) return
    // menu is set to display:none, shouldn't ever happen
    if (!menu.offsetParent) return
    const parentRect = menu.offsetParent.getBoundingClientRect()
    menu.style.opacity = '1'
    menu.style.top = `${rect.bottom - parentRect.top + 3}px`

    menu.style.left = `${Math.max(
      rect.left - parentRect.left - menu.offsetWidth / 2 + rect.width / 2,
      0
    )}px`
  }, [overlay])

  return (
    <InlineOverlayWrapper ref={overlay}>
      <InlinePreview>{props.children}</InlinePreview>
      <ChangeButton onClick={props.onEdit}>
        <Icon icon={faPencilAlt} />
      </ChangeButton>
      <ChangeButton onClick={props.onDelete}>
        <Icon icon={faTrashAlt} />
      </ChangeButton>
    </InlineOverlayWrapper>
  )
}

const ConfigIconContainer = styled.div({
  position: 'relative'
})
const ConfigIcon = styled.div((props: EditorThemeProps) => {
  const theme = createOverlayTheme('overlay', props.theme)

  return {
    position: 'absolute',
    textAlign: 'center',
    width: '100%',
    height: '100%',
    top: 0,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.backgroundColor,
    color: theme.color,
    opacity: 0,
    '&:hover': {
      opacity: 1,
      transition: 'opacity 0.3s ease',
      cursor: 'pointer'
    }
  }
})

export function ContainerWithConfigButton(props: {
  children?: React.ReactNode
}) {
  const overlayContext = React.useContext(OverlayContext)
  return (
    <ConfigIconContainer onClick={overlayContext.show}>
      {props.children}
      <ConfigIcon>
        <Icon icon={faCog} size="3x" />
      </ConfigIcon>
    </ConfigIconContainer>
  )
}

export interface OverlayTheme {
  backgroundColor: string
  color: string
  overlayBackgroundColor: string
  highlightColor: string
}
