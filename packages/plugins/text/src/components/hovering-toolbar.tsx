import { TextPluginConfig } from '@edtr-io/plugin-text'
import { styled } from '@edtr-io/ui'
import React from 'react'
import { Editor as SlateEditor, Range } from 'slate'
import { ReactEditor, useSlate } from 'slate-react'

import { InlineOverlay, InlineOverlayPosition } from './inline-overlay'

const Button = styled.button<{
  active?: boolean
  config: TextPluginConfig
}>(({ active, config }) => {
  const { theme } = config

  return {
    backgroundColor: active
      ? theme.active.backgroundColor
      : theme.backgroundColor,
    cursor: 'pointer',
    boxShadow: active ? 'inset 0 1px 3px 0 rgba(0,0,0,0.50)' : undefined,
    color: active ? theme.active.color : theme.color,
    outline: 'none',
    height: '25px',
    border: 'none',
    borderRadius: '4px',
    margin: '5px',
    padding: '0px',
    width: '25px',
    '&:hover': {
      color: theme.hoverColor,
    },
  }
})

interface HoveringToolbarProps {
  closeSubMenuIcon: React.ReactNode
  closeSubMenuTitle: string
  config: TextPluginConfig
}

const initialPosition = isTouchDevice()
  ? InlineOverlayPosition.below
  : InlineOverlayPosition.above

export type TextEditorControl = ControlButton // | NestedControlButton

export interface ControlButton {
  title: string
  isActive(): boolean
  onClick(): void
  renderIcon(): React.ReactNode
}

// TODO:
function isNestedControlButton(_control: TextEditorControl) {
  return false
}

export function HoveringToolbar({
  closeSubMenuIcon,
  closeSubMenuTitle,
  config,
}: HoveringToolbarProps) {
  const editor = useSlate()
  const [subMenu, setSubMenu] = React.useState<number>()
  const { selection } = editor

  function isBoldActive() {
    const marks = SlateEditor.marks(editor)
    return marks ? marks.strong === true : false
  }

  const controls: TextEditorControl[] = [
    {
      title: 'Bold',
      isActive: isBoldActive,
      onClick: () => {
        const isActive = isBoldActive()

        if (isActive) {
          SlateEditor.removeMark(editor, 'strong')
        } else {
          SlateEditor.addMark(editor, 'strong', true)
        }
      },
      renderIcon: () => <strong>B</strong>,
    },
  ]

  return (
    <InlineOverlay
      initialPosition={initialPosition}
      hidden={
        !selection ||
        !ReactEditor.isFocused(editor) ||
        Range.isCollapsed(selection) ||
        SlateEditor.string(editor, selection) === ''
      }
    >
      {renderChildren()}
    </InlineOverlay>
  )

  function renderChildren() {
    if (typeof subMenu === 'number') {
      const activeControl = controls[subMenu]
      if (!isNestedControlButton(activeControl)) return null
      return null
      // return (
      //   <React.Fragment>
      //     {activeControl.children.map((control, key) => {
      //       return renderControlButton(control, key)
      //     })}
      //     {renderControlButton({
      //       isActive() {
      //         return false
      //       },
      //       renderIcon() {
      //         return closeSubMenuIcon
      //       },
      //       onClick() {
      //         setSubMenu(undefined)
      //       },
      //       title: closeSubMenuTitle,
      //     })}
      //   </React.Fragment>
      // )
    }

    return controls.map((control, index) => {
      // if (isNestedControlButton(control)) {
      //   const { title, renderIcon, isActive } = control
      //   return (
      //     <Button
      //       key={index}
      //       active={isActive()}
      //       // config={config}
      //       title={title}
      //       onMouseDown={(event) => {
      //         event.preventDefault()
      //         setSubMenu(index)
      //       }}
      //     >
      //       {renderIcon()}
      //     </Button>
      //   )
      // }
      return renderControlButton(control, index)
    })

    function renderControlButton(control: ControlButton, key?: number) {
      const { title, isActive, onClick, renderIcon } = control
      return (
        <Button
          key={key}
          active={isActive()}
          config={config}
          title={title}
          onMouseDown={(event) => {
            event.preventDefault()
            onClick()
          }}
        >
          {renderIcon()}
        </Button>
      )
    }
  }
}

function isTouchDevice() {
  return (
    typeof window !== 'undefined' &&
    ('ontouchstart' in window ||
      navigator.maxTouchPoints > 0 ||
      // @ts-expect-error TODO:
      navigator.msMaxTouchPoints > 0)
  )
}
