import * as React from 'react'
import { createPortal } from 'react-dom'
import { Icon, styled, faTimes, faTrashAlt, faPencilAlt } from '..'
import { OnClickOutside } from './onClickOutside'
import { HotKeys } from 'react-hotkeys'
import { OverlayContext } from '@edtr-io/core'

const OverlayWrapper = styled.div({
  width: '100%',
  height: '100%',
  position: 'fixed',
  top: 0,
  left: 0,
  backgroundColor: '#00000033',
  zIndex: 99,
  padding: '20px'
})
const OverlayBox = styled.div({
  width: '60%',
  height: '60%',
  position: 'absolute',
  zIndex: 100,
  backgroundColor: 'rgb(51,51,51,0.95)',
  paddingBottom: '10px',
  left: '20%',
  top: '20%'
})

const SettingButton = styled.button<{ light?: boolean }>(({ light }) => ({
  float: 'right',
  position: 'relative',
  color: light ? '#aaaaaa' : '#999999',
  fontSize: 16,
  zIndex: 98,
  outline: 'none',
  border: 'none',
  backgroundColor: 'transparent',
  paddingTop: '5px',
  '&:hover': {
    color: light ? '#eeeeee' : 'rgb(51,51,51)'
  }
}))

export const Overlay: React.FunctionComponent = props => {
  const overlayContext = React.useContext(OverlayContext)
  return overlayContext.node.current && overlayContext.visible
    ? createPortal(
        <HotKeys
          keyMap={{
            CLOSE: 'enter'
          }}
          handlers={{
            CLOSE: () => {
              overlayContext.hide()
            }
          }}
        >
          <OverlayWrapper>
            <OnClickOutside onClick={overlayContext.hide}>
              <OverlayBox>
                <SettingButton
                  onClick={overlayContext.hide}
                  light
                  style={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    zIndex: 101
                  }}
                >
                  <Icon icon={faTimes} />
                </SettingButton>
                {props.children}
              </OverlayBox>
            </OnClickOutside>
          </OverlayWrapper>
        </HotKeys>,
        overlayContext.node.current
      )
    : null
}

const InlineOverlayWrapper = styled.div({
  position: 'fixed',
  opacity: 0,
  transition: 'opacity 0.5s',
  backgroundColor: 'rgba(51,51,51,0.95)',
  color: '#eeeeee',
  padding: '5px',
  zIndex: 100,
  '& a': {
    color: '#eeeeee'
  }
})
const InlinePreview = styled.span({
  padding: '0px 8px'
})
const ChangeButton = styled.div({
  padding: '5px 5px 5px 10px',
  display: 'inline-block',
  borderLeft: '2px solid #eeeeee',
  cursor: 'pointer',
  margin: '2px'
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
    menu.style.opacity = '1'
    menu.style.top = `${rect.bottom + window.pageYOffset + 3}px`

    menu.style.left = `${Math.max(
      rect.left + window.pageXOffset - menu.offsetWidth / 2 + rect.width / 2,
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
