import * as R from 'ramda'
import React from 'react'
import { Editor as SlateEditor } from 'slate'

import type {
  TextEditorPluginConfig,
  NestedControlButton,
  ControlButton,
} from '../types'
import { HoveringToolbarButton } from './hovering-toolbar-button'

export interface HoveringToolbarControlsProps {
  theme: TextEditorPluginConfig['theme']
  controls: ControlButton[]
  editor: SlateEditor
}

function isNestedControlButton(
  control: ControlButton
): control is NestedControlButton {
  return R.has('children', control)
}

export function HoveringToolbarControls(props: HoveringToolbarControlsProps) {
  const { theme, controls, editor } = props
  const [subMenu, setSubMenu] = React.useState<number>()

  if (typeof subMenu !== 'number') {
    return (
      <>
        {controls.map((control, index) => (
          <HoveringToolbarButton
            active={control.isActive(editor)}
            theme={theme}
            title={control.title}
            onMouseDown={(event) => {
              event.preventDefault()
              isNestedControlButton(control)
                ? setSubMenu(index)
                : control.onClick(editor)
            }}
            key={index}
          >
            {control.renderIcon(editor)}
          </HoveringToolbarButton>
        ))}
      </>
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
    <>
      {subMenuControls.map((control, index) => (
        <HoveringToolbarButton
          active={control.isActive(editor)}
          theme={theme}
          title={control.title}
          onMouseDown={(event) => {
            event.preventDefault()
            control.onClick(editor)
          }}
          key={index}
        >
          {control.renderIcon(editor)}
        </HoveringToolbarButton>
      ))}
    </>
  )
}
