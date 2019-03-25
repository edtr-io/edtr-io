import * as React from 'react'
import { createPortal } from 'react-dom'
import {
  Icon,
  styled,
  faTimes,
  faTrashAlt,
  faPencilAlt,
  EditorTheming,
  defaultTheming
} from '..'
import { OnClickOutside } from './onClickOutside'
import { HotKeys } from 'react-hotkeys'
import { OverlayContext } from '@edtr-io/core'
import { ThemeProps } from 'styled-components'

const OverlayWrapper = styled.div({
  width: '100%',
  height: '100%',
  position: 'fixed',
  top: 0,
  left: 0,
  backgroundColor: '#00000033',
  zIndex: 99
})
const OverlayBox = styled.div((props: ThemeProps<EditorTheming>) => ({
  minHeight: '60%',
  margin: '0 auto',
  position: 'absolute',
  zIndex: 100,
  backgroundColor: props.theme.backgroundColor,
  paddingBottom: '10px',
  left: '8%',
  right: '8%',
  maxWidth: '1150px',
  top: '20%'
}))
OverlayBox.defaultProps = {
  theme: defaultTheming
}

const CloseButton = styled.button((props: ThemeProps<EditorTheming>) => ({
  float: 'right',
  position: 'relative',
  color: props.theme.textColor,
  fontSize: 16,
  zIndex: 98,
  outline: 'none',
  border: 'none',
  backgroundColor: 'transparent',
  paddingTop: '5px',
  '&:hover': {
    color: props.theme.highlightColor
  }
}))
CloseButton.defaultProps = {
  theme: defaultTheming
}
const ContentWrapper = styled.div({
  padding: '20px 15%'
})

export const Overlay: React.FunctionComponent<{
  onClose?: () => void
}> = props => {
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
              <OverlayBox>
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
              </OverlayBox>
            </OnClickOutside>
          </OverlayWrapper>
        </HotKeys>,
        overlayContext.node.current
      )
    : null
}

const InlineOverlayWrapper = styled.div((props: ThemeProps<EditorTheming>) => ({
  position: 'absolute',
  top: '-10000px',
  left: '-10000px',
  opacity: 0,
  transition: 'opacity 0.5s',
  backgroundColor: props.theme.backgroundColor,
  color: props.theme.textColor,
  padding: '5px',
  zIndex: 100,
  '& a': {
    color: props.theme.textColor,
    '&:hover': {
      color: props.theme.highlightColor
    }
  }
}))
InlineOverlayWrapper.defaultProps = { theme: defaultTheming }
const InlinePreview = styled.span({
  padding: '0px 8px'
})
const ChangeButton = styled.div((props: ThemeProps<EditorTheming>) => ({
  padding: '5px 5px 5px 10px',
  display: 'inline-block',
  borderLeft: `2px solid ${props.theme.textColor}`,
  cursor: 'pointer',
  margin: '2px',
  '&:hover': {
    color: props.theme.highlightColor
  }
}))
ChangeButton.defaultProps = { theme: defaultTheming }

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
