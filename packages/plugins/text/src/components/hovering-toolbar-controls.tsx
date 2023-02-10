import * as R from 'ramda'
import React, { MouseEvent } from 'react'

import { useToolbarControls } from '../hooks/use-toolbar-controls'
import type {
  HoveringToolbarControlsProps,
  NestedControlButton,
  TextEditorControl,
} from '../types'
import { HoveringToolbarButton } from './hovering-toolbar-button'

function isNestedControlButton(
  control: TextEditorControl
): control is NestedControlButton {
  return R.has('children', control)
}

export const HoveringToolbarControls = ({
  editor,
  config,
}: HoveringToolbarControlsProps) => {
  const [subMenu, setSubMenu] = React.useState<number>()

  const controls = useToolbarControls(config)

  const mouseDownHandler = (
    event: MouseEvent,
    control: TextEditorControl,
    index: number
  ) => {
    event.preventDefault()
    isNestedControlButton(control) ? setSubMenu(index) : control.onClick(editor)
  }

  if (typeof subMenu !== 'number') {
    return (
      <>
        {controls.map((control, index) => (
          <HoveringToolbarButton
            editor={editor}
            config={config}
            index={index}
            control={control}
            setSubMenu={setSubMenu}
            onMouseDown={mouseDownHandler}
            key={index}
          />
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
  activeControl.children.push(closeSubMenuControl)

  return (
    <>
      {activeControl.children.map((control, index) => (
        <HoveringToolbarButton
          editor={editor}
          config={config}
          index={index}
          control={control}
          setSubMenu={setSubMenu}
          onMouseDown={mouseDownHandler}
          key={index}
        />
      ))}
    </>
  )
}
