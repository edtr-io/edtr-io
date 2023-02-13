import * as R from 'ramda'
import React from 'react'
import { Editor as SlateEditor, Range } from 'slate'
import { ReactEditor, useSlate } from 'slate-react'

import { useToolbarControls } from '../hooks/use-toolbar-controls'
import type {
  TextPluginConfig,
  NestedControlButton,
  TextEditorControl,
} from '../types'
import { isTouchDevice } from '../utils/is-touch-device'
import { HoveringToolbarButton } from './hovering-toolbar-button'
import { InlineOverlay, InlineOverlayPosition } from './inline-overlay'

export interface HoveringToolbarProps {
  config: TextPluginConfig
}

const initialPosition = isTouchDevice()
  ? InlineOverlayPosition.below
  : InlineOverlayPosition.above

function isNestedControlButton(
  control: TextEditorControl
): control is NestedControlButton {
  return R.has('children', control)
}

export function HoveringToolbar({ config }: HoveringToolbarProps) {
  const [subMenu, setSubMenu] = React.useState<number>()
  const editor = useSlate()
  const { selection } = editor
  const controls = useToolbarControls(config)

  if (typeof subMenu !== 'number') {
    return (
      <InlineOverlay
        config={config}
        initialPosition={initialPosition}
        hidden={
          !selection ||
          !ReactEditor.isFocused(editor) ||
          Range.isCollapsed(selection) ||
          SlateEditor.string(editor, selection) === ''
        }
      >
        {controls.map((control, index) => (
          <HoveringToolbarButton
            active={control.isActive(editor)}
            theme={config.theme}
            title={control.title}
            onMouseDown={(event) => {
              event.preventDefault()
              isNestedControlButton(control)
                ? setSubMenu(index)
                : control.onClick(editor)
            }}
            key={index}
          >
            {control.renderIcon()}
          </HoveringToolbarButton>
        ))}
      </InlineOverlay>
    )
  }

  const activeControl = controls[subMenu]

  if (!isNestedControlButton(activeControl)) return null

  const closeSubMenuControl = {
    isActive() {
      return false
    },
    renderIcon() {
      return activeControl.renderCloseMenuIcon()
    },
    onClick() {
      setSubMenu(undefined)
    },
    title: activeControl.closeMenuTitle,
  }
  const subMenuControls = [...activeControl.children, closeSubMenuControl]

  return (
    <InlineOverlay
      config={config}
      initialPosition={initialPosition}
      hidden={
        !selection ||
        !ReactEditor.isFocused(editor) ||
        Range.isCollapsed(selection) ||
        SlateEditor.string(editor, selection) === ''
      }
    >
      {subMenuControls.map((control, index) => (
        <HoveringToolbarButton
          active={control.isActive(editor)}
          theme={config.theme}
          title={control.title}
          onMouseDown={(event) => {
            event.preventDefault()
            control.onClick(editor)
          }}
          key={index}
        >
          {control.renderIcon()}
        </HoveringToolbarButton>
      ))}
    </InlineOverlay>
  )
}
