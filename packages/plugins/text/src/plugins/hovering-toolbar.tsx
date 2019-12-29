import { styled } from '@edtr-io/ui'
import * as React from 'react'
import { Range, Editor as SlateEditor } from 'slate'
import { ReactEditor } from 'slate-react'

import { useEditor } from '../helpers'
import { Editor, TextEditorPlugin } from '../types'

const Button = styled.button((props: { active?: boolean }) => {
  return {
    // TODO:
    // backgroundColor: props.active
    //   ? theme.active.backgroundColor
    //   : theme.backgroundColor,
    cursor: 'pointer',
    boxShadow: props.active ? 'inset 0 1px 3px 0 rgba(0,0,0,0.50)' : undefined,
    // TODO:
    // color: props.active ? theme.active.color : theme.color,
    outline: 'none',
    height: '25px',
    border: 'none',
    borderRadius: '4px',
    margin: '5px',
    padding: '0px',
    width: '25px'
    // TODO:
    // '&:hover': {
    //   color: theme.hoverColor
    // }
  }
})

export function createHoveringToolbarPlugin(): TextEditorPlugin {
  return function(editor: Editor) {
    const { renderEditable } = editor
    // eslint-disable-next-line react/display-name
    editor.renderEditable = props => {
      return (
        <React.Fragment>
          {props.editable ? (
            <HoveringToolbar>
              {editor.controls.map(({ title, onClick }, index) => {
                return (
                  <Button
                    key={index}
                    title={title}
                    onMouseDown={event => {
                      event.preventDefault()
                      onClick()
                    }}
                  >
                    {title}
                  </Button>
                )
              })}
            </HoveringToolbar>
          ) : null}
          {renderEditable(props)}
        </React.Fragment>
      )
    }
    return editor
  }
}

enum HoverPosition {
  above = 'above',
  below = 'below'
}

const OverlayTriangle = styled.div<{ positionAbove: boolean }>(props => {
  const borderPosition = props.positionAbove ? 'borderTop' : 'borderBottom'
  return {
    position: 'relative',
    width: 0,
    height: 0,
    borderLeft: '5px solid transparent',
    borderRight: '5px solid transparent',
    [borderPosition]: '10px solid rgba(51,51,51,0.95)'
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

const InlineOverlayContentWrapper = styled.div({
  boxShadow: '0 2px 4px 0 rgba(0,0,0,0.50)',
  backgroundColor: 'rgba(51,51,51,0.95)',
  color: '#ffffff',
  borderRadius: '4px',
  '& a': {
    color: '#ffffff',
    '&:hover': {
      color: 'rgb(70, 155, 255)'
    }
  }
})

const initialPosition = isTouchDevice()
  ? HoverPosition.below
  : HoverPosition.above

function HoveringToolbar({ children }: React.PropsWithChildren<{}>) {
  const editor = useEditor()
  const menu = React.useRef<HTMLDivElement>(null)
  const triangle = React.useRef<HTMLDivElement>(null)
  const [position, setPosition] = React.useState(initialPosition)

  // eslint-disable-next-line react-hooks/exhaustive-deps
  React.useEffect(() => {
    if (!menu.current || !triangle.current) return
    const { selection } = editor
    if (
      !selection ||
      !ReactEditor.isFocused(editor) ||
      Range.isCollapsed(selection) ||
      SlateEditor.string(editor, selection) === ''
    ) {
      menu.current.style.top = ''
      menu.current.style.left = ''
      return
    }

    const domSelection = window.getSelection()
    if (!domSelection || domSelection.rangeCount === 0) return

    const domRange = domSelection.getRangeAt(0)
    const rect = domRange.getBoundingClientRect()

    if (!rect || rect.height === 0) return

    if (!menu.current.offsetParent) return
    const parentRect = menu.current.offsetParent.getBoundingClientRect()

    if (
      parentRect.top - 5 > rect.top ||
      parentRect.top + parentRect.height + 5 < rect.top + rect.height ||
      parentRect.left - 5 > rect.left ||
      parentRect.left + parentRect.width + 5 < rect.left + rect.width
    ) {
      menu.current.style.top = ''
      menu.current.style.left = ''
      return
    }

    menu.current.style.opacity = '1'
    const aboveValue = rect.top - menu.current.offsetHeight - 6
    setPosition(
      initialPosition === HoverPosition.above && aboveValue >= 0
        ? HoverPosition.above
        : HoverPosition.below
    )
    menu.current.style.top = `${(position === HoverPosition.above
      ? aboveValue
      : rect.bottom + 6) - parentRect.top}px`
    menu.current.style.left = `${Math.min(
      Math.max(
        rect.left -
          parentRect.left -
          menu.current.offsetWidth / 2 +
          rect.width / 2,
        0
      ),
      parentRect.width - menu.current.offsetWidth - 5
    )}px`
    triangle.current.style.left = `${rect.left -
      menu.current.offsetLeft -
      parentRect.left -
      triangle.current.offsetWidth / 2 +
      rect.width / 2}px`
  })

  return (
    <InlineOverlayWrapper ref={menu}>
      {position === HoverPosition.below ? (
        <OverlayTriangle positionAbove={false} ref={triangle} />
      ) : null}
      <InlineOverlayContentWrapper>{children}</InlineOverlayContentWrapper>
      {position === HoverPosition.above ? (
        <OverlayTriangle positionAbove ref={triangle} />
      ) : null}
    </InlineOverlayWrapper>
  )
}

function isTouchDevice() {
  return (
    'ontouchstart' in window ||
    navigator.maxTouchPoints > 0 ||
    navigator.msMaxTouchPoints > 0
  )
}
