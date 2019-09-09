import { OverlayContext } from '@edtr-io/core'
import {
  createEditorUiTheme,
  EditorThemeProps,
  OverlayTheme,
  styled
} from '@edtr-io/ui'
import * as React from 'react'
import { createPortal } from 'react-dom'
import { HotKeys } from 'react-hotkeys'

import { Icon, faTimes, faTrashAlt, faCog } from './icon'
import { OnClickOutside } from './on-click-outside'
import { createOverlayButtonTheme } from './overlay-button'
import { createOverlayCheckboxTheme } from './overlay-checkbox'
import { createOverlayInputTheme } from './overlay-input'
import { createOverlayTextareaTheme } from './overlay-textarea'

export const createOverlayTheme = (themeProp: EditorThemeProps['theme']) => {
  const themeCreator = createEditorUiTheme<OverlayTheme>(theme => {
    return {
      backgroundColor: theme.backgroundColor,
      color: theme.color,
      overlayBackgroundColor: '#00000033',
      highlightColor: theme.primary.background,
      button: createOverlayButtonTheme('button', themeProp),
      input: createOverlayInputTheme('input', themeProp),
      textarea: createOverlayTextareaTheme('textarea', themeProp),
      checkbox: createOverlayCheckboxTheme('checkbox', themeProp)
    }
  })

  return themeCreator('overlay', themeProp)
}

const OverlayWrapper = styled.div<EditorThemeProps>(props => {
  const theme = createOverlayTheme(props.theme)

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

export const OverlayBox = styled.div<EditorThemeProps>(props => {
  const theme = createOverlayTheme(props.theme)

  return {
    margin: '0 auto',
    position: 'absolute',
    boxShadow: '0 2px 4px 0 rgba(0,0,0,0.50)',
    borderRadius: '4px',
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

const CloseButton = styled.button<EditorThemeProps>(props => {
  const theme = createOverlayTheme(props.theme)

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

const OverlayTriangle = styled.div<
  EditorThemeProps & { positionAbove: boolean }
>(props => {
  const theme = createOverlayTheme(props.theme)
  const borderPosition = props.positionAbove ? 'borderTop' : 'borderBottom'
  return {
    position: 'relative',
    width: 0,
    height: 0,
    borderLeft: '5px solid transparent',
    borderRight: '5px solid transparent',
    [borderPosition]: `10px solid ${theme.backgroundColor}`
  }
})
const InlineOverlayWrapper = styled.div({
  position: 'absolute',
  top: '-10000px',
  left: '-10000px',
  opacity: 0,
  transition: 'opacity 0.5s',
  zIndex: 95,
  whiteSpace: 'nowrap'
})

const InlineOverlayContentWrapper = styled.div((props: EditorThemeProps) => {
  const theme = createOverlayTheme(props.theme)
  return {
    boxShadow: '0 2px 4px 0 rgba(0,0,0,0.50)',
    backgroundColor: theme.backgroundColor,
    color: theme.color,
    borderRadius: '4px',
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
  const theme = createOverlayTheme(props.theme)

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

export const InlineSettings: React.FunctionComponent<{
  onDelete: React.MouseEventHandler
  position: HoverPosition
  anchor?: React.RefObject<HTMLElement>
}> = ({ position = 'below', ...props }) => {
  return (
    <HoveringOverlay position={position} anchor={props.anchor}>
      <InlinePreview>{props.children}</InlinePreview>
      <ChangeButton onClick={props.onDelete}>
        <Icon icon={faTrashAlt} />
      </ChangeButton>
    </HoveringOverlay>
  )
}

export type HoverPosition = 'above' | 'below'

export const HoveringOverlay: React.FunctionComponent<{
  position: HoverPosition
  anchor?: React.RefObject<HTMLElement>
  ignoreSelection?: boolean
}> = props => {
  const overlay = React.createRef<HTMLDivElement>()
  const triangle = React.createRef<HTMLDivElement>()
  const [positionAbove, setPositionAbove] = React.useState(
    props.position === 'above'
  )

  React.useLayoutEffect(() => {
    if (!overlay.current || !triangle.current) return
    const menu = overlay.current
    let rect = undefined
    if (props.anchor && props.anchor.current !== null) {
      rect = props.anchor.current.getBoundingClientRect()
    } else {
      const native = window.getSelection()
      if (native && native.rangeCount > 0) {
        const range = native.getRangeAt(0)
        rect = range.getBoundingClientRect()
      }
    }
    if (!rect) return
    if (rect.height === 0) return
    // menu is set to display:none, shouldn't ever happen
    if (!menu.offsetParent) return
    const parentRect = menu.offsetParent.getBoundingClientRect()
    // only show menu if selection is inside of parent
    if (
      parentRect.top - 5 > rect.top ||
      parentRect.top + parentRect.height + 5 < rect.top + rect.height ||
      parentRect.left - 5 > rect.left ||
      parentRect.left + parentRect.width + 5 < rect.left + rect.width
    ) {
      if (!props.ignoreSelection) {
        menu.style.top = null
        menu.style.left = null
        return
      }
    }
    menu.style.opacity = '1'
    const aboveValue = rect.top - menu.offsetHeight - 6
    // if top becomes negative, place menu below
    setPositionAbove(props.position == 'above' && aboveValue >= 0)
    menu.style.top =
      (positionAbove ? aboveValue : rect.bottom + 6) - parentRect.top + 'px'

    menu.style.left = `${Math.min(
      Math.max(
        rect.left - parentRect.left - menu.offsetWidth / 2 + rect.width / 2,
        0
      ),
      parentRect.width - menu.offsetWidth - 5
    )}px`
    triangle.current.style.left = `${rect.left -
      menu.offsetLeft -
      parentRect.left -
      triangle.current.offsetWidth / 2 +
      rect.width / 2}px`
  }, [
    overlay,
    triangle,
    props.position,
    props.anchor,
    positionAbove,
    props.ignoreSelection
  ])

  return (
    <InlineOverlayWrapper ref={overlay}>
      {!positionAbove && (
        <OverlayTriangle positionAbove={false} ref={triangle} />
      )}
      <InlineOverlayContentWrapper>
        {props.children}
      </InlineOverlayContentWrapper>
      {positionAbove && <OverlayTriangle positionAbove ref={triangle} />}
    </InlineOverlayWrapper>
  )
}

const ConfigIconContainer = styled.div({
  position: 'relative'
})
const ConfigIcon = styled.div<EditorThemeProps>(props => {
  const theme = createOverlayTheme(props.theme)

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
