import { edtrClose, EdtrIcon, styled } from '@edtr-io/ui'
import * as React from 'react'
import { Editor as SlateEditor, Range } from 'slate'
import { ReactEditor } from 'slate-react'

import {
  InlineOverlay,
  InlineOverlayPosition
} from '../components/inline-overlay'
import { useConfig, useEditor } from '../helpers'
import {
  ControlButton,
  isNestedControlButton,
  TextConfig,
  TextEditorPlugin
} from '../types'

const Button = styled.button<{
  active?: boolean
  config: TextConfig
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
      color: theme.hoverColor
    }
  }
})

export function createHoveringToolbarPlugin({
  closeSubMenuIcon = <EdtrIcon icon={edtrClose} />,
  closeSubMenuTitle = 'Untermenü schließen'
}: {
  closeSubMenuIcon?: HoveringToolbarProps['closeSubMenuIcon']
  closeSubMenuTitle?: HoveringToolbarProps['closeSubMenuTitle']
} = {}): TextEditorPlugin {
  return function(editor) {
    const { renderEditable } = editor
    // eslint-disable-next-line react/display-name
    editor.renderEditable = props => {
      return (
        <React.Fragment>
          {props.editable && editor.controls.length > 0 ? (
            <HoveringToolbar
              closeSubMenuIcon={closeSubMenuIcon}
              closeSubMenuTitle={closeSubMenuTitle}
            />
          ) : null}
          {renderEditable(props)}
        </React.Fragment>
      )
    }
    return editor
  }
}

const initialPosition = isTouchDevice()
  ? InlineOverlayPosition.below
  : InlineOverlayPosition.above

function HoveringToolbar({
  closeSubMenuIcon,
  closeSubMenuTitle
}: HoveringToolbarProps) {
  const editor = useEditor()
  const config = useConfig()
  const [subMenu, setSubMenu] = React.useState<number>()
  const { selection } = editor

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
      const activeControl = editor.controls[subMenu]
      if (!isNestedControlButton(activeControl)) return null
      return (
        <React.Fragment>
          {activeControl.children.map((control, key) => {
            return renderControlButton(control, key)
          })}
          {renderControlButton({
            isActive() {
              return false
            },
            renderIcon() {
              return closeSubMenuIcon
            },
            onClick() {
              setSubMenu(undefined)
            },
            title: closeSubMenuTitle
          })}
        </React.Fragment>
      )
    }

    return editor.controls.map((control, index) => {
      if (isNestedControlButton(control)) {
        const { title, renderIcon, isActive } = control
        return (
          <Button
            key={index}
            active={isActive()}
            config={config}
            title={title}
            onMouseDown={event => {
              event.preventDefault()
              setSubMenu(index)
            }}
          >
            {renderIcon()}
          </Button>
        )
      }
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
          onMouseDown={event => {
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

interface HoveringToolbarProps {
  closeSubMenuIcon: React.ReactNode
  closeSubMenuTitle: string
}

function isTouchDevice() {
  return (
    typeof window !== 'undefined' &&
    ('ontouchstart' in window ||
      navigator.maxTouchPoints > 0 ||
      navigator.msMaxTouchPoints > 0)
  )
}
