import { styled } from '@edtr-io/ui'
import * as React from 'react'

const OverlayTriangle = styled.div<{ positionAbove: boolean }>((props) => {
  const borderPosition = props.positionAbove ? 'borderTop' : 'borderBottom'
  return {
    position: 'relative',
    width: 0,
    height: 0,
    borderLeft: '5px solid transparent',
    borderRight: '5px solid transparent',
    [borderPosition]: '10px solid rgba(51,51,51,0.95)',
  }
})

const InlineOverlayWrapper = styled.div({
  position: 'absolute',
  top: '-10000px',
  left: '-10000px',
  opacity: 0,
  transition: 'opacity 0.5s',
  zIndex: 95,
  whiteSpace: 'nowrap',
})

const InlineOverlayContentWrapper = styled.div({
  boxShadow: '0 2px 4px 0 rgba(0,0,0,0.50)',
  backgroundColor: 'rgba(51,51,51,0.95)',
  color: '#ffffff',
  borderRadius: '4px',
  '& a': {
    color: '#ffffff',
    '&:hover': {
      color: 'rgb(70, 155, 255)',
    },
  },
})

export type HoverPosition = 'above' | 'below'

export function HoveringOverlay(props: {
  children: React.ReactNode
  position: HoverPosition
  anchor?: React.RefObject<HTMLElement>
  allowSelectionOverflow?: boolean
}) {
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
    menu.style.opacity = '1'
    const aboveValue = rect.top - menu.offsetHeight - 6
    // if top becomes negative, place menu below
    setPositionAbove(props.position == 'above' && aboveValue >= 0)
    menu.style.top = `${
      (positionAbove ? aboveValue : rect.bottom + 6) - parentRect.top
    }px`

    menu.style.left = `${Math.min(
      Math.max(
        rect.left - parentRect.left - menu.offsetWidth / 2 + rect.width / 2,
        0
      ),
      parentRect.width - menu.offsetWidth - 5
    )}px`
    triangle.current.style.left = `${
      rect.left -
      menu.offsetLeft -
      parentRect.left -
      triangle.current.offsetWidth / 2 +
      rect.width / 2
    }px`
  }, [
    overlay,
    triangle,
    props.position,
    props.anchor,
    positionAbove,
    props.allowSelectionOverflow,
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
