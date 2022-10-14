import { TextPluginConfig } from '@edtr-io/plugin-text'
import * as R from 'ramda'
import { styled } from '@edtr-io/ui'
import React from 'react'
import { Editor as SlateEditor, Range, Transforms, Element } from 'slate'
import { ReactEditor, useSlate } from 'slate-react'

import { InlineOverlay, InlineOverlayPosition } from './inline-overlay'
import { config as defaultConfig } from '..'

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

export type TextEditorControl = ControlButton | NestedControlButton

export interface ControlButton {
  title: string
  isActive(): boolean
  onClick(): void
  renderIcon(): React.ReactNode
}

export interface NestedControlButton {
  title: string
  children: ControlButton[]
  renderIcon(): React.ReactNode
  isActive(): boolean
}

function isNestedControlButton(
  control: TextEditorControl
): control is NestedControlButton {
  return R.has('children', control)
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
    return SlateEditor.marks(editor)?.strong === true
  }
  function isCodeActive() {
    return SlateEditor.marks(editor)?.code === true
  }

  function isItalicActive() {
    return SlateEditor.marks(editor)?.em === true
  }

  function isAnyColorActive() {
    return typeof SlateEditor.marks(editor)?.color === 'number'
  }

  function isColorActive(colorIndex: number) {
    return SlateEditor.marks(editor)?.color === colorIndex
  }

  function isAnyHeadingActive() {
    const { selection } = editor
    if (!selection) return false

    const [match] = Array.from(
      SlateEditor.nodes(editor, {
        at: SlateEditor.unhangRange(editor, selection),
        match: (n) =>
          !SlateEditor.isEditor(n) && Element.isElement(n) && n['type'] === 'h',
      })
    )

    return !!match
  }

  function isHeadingActive(heading: number) {
    const { selection } = editor
    if (!selection) return false

    const [match] = Array.from(
      SlateEditor.nodes(editor, {
        at: SlateEditor.unhangRange(editor, selection),
        match: (n) =>
          !SlateEditor.isEditor(n) &&
          Element.isElement(n) &&
          n['type'] === 'h' &&
          n.level === heading,
      })
    )

    return !!match
  }

  const controls: TextEditorControl[] = [
    {
      title: 'Bold',
      isActive: isBoldActive,
      onClick: () => {
        if (isBoldActive()) {
          SlateEditor.removeMark(editor, 'strong')
        } else {
          SlateEditor.addMark(editor, 'strong', true)
        }
      },
      renderIcon: () => <strong>B</strong>,
    },
    {
      title: 'Italic',
      isActive: isItalicActive,
      onClick: () => {
        if (isItalicActive()) {
          SlateEditor.removeMark(editor, 'em')
        } else {
          SlateEditor.addMark(editor, 'em', true)
        }
      },
      renderIcon: () => <em>I</em>,
    },
    {
      title: 'Color',
      isActive: isAnyColorActive,
      renderIcon: () => <span>C</span>,
      // TODO: color should come from config
      children: [
        {
          // TODO: get color name
          title: 'Color reset',
          isActive: () => !isAnyColorActive(),
          onClick: () => {
            SlateEditor.removeMark(editor, 'color')
          },
          renderIcon: () => (
            // TODO: Design
            <span style={{ backgroundColor: 'black' }}>&nbsp;</span>
          ),
        },
        ...defaultConfig.colors.map((color, colorIndex) => {
          return {
            // TODO: get color name
            title: 'color-#',
            isActive: () => isColorActive(colorIndex),
            onClick: () => {
              if (isColorActive(colorIndex)) {
                SlateEditor.removeMark(editor, 'color')
              } else {
                SlateEditor.addMark(editor, 'color', colorIndex)
              }
            },
            renderIcon: () => (
              <span style={{ backgroundColor: color }}>&nbsp;</span>
            ),
          }
        }),
      ],
    },
    {
      title: 'Code',
      isActive: isCodeActive,
      onClick: () => {
        if (isCodeActive()) {
          SlateEditor.removeMark(editor, 'code')
        } else {
          SlateEditor.addMark(editor, 'code', true)
        }
      },
      renderIcon: () => <code>C</code>,
    },
    {
      title: 'Heading',
      isActive: isAnyHeadingActive,
      renderIcon: () => <span>C</span>,
      children:
        // TODO: change to config
        [1 as const, 2 as const, 3 as const].map((heading) => {
          return {
            title: `h${heading}`,
            isActive: () => isHeadingActive(heading),
            onClick: () => {
              if (isHeadingActive(heading)) {
                Transforms.setNodes(editor, {
                  type: 'p',
                })
                Transforms.unsetNodes(editor, 'level')
              } else {
                Transforms.setNodes(editor, {
                  type: 'h',
                  level: heading,
                })
              }
            },
            renderIcon: () => <span>T{heading}</span>,
          }
        }),
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
            title: closeSubMenuTitle,
          })}
        </React.Fragment>
      )
    }

    return controls.map((control, index) => {
      if (isNestedControlButton(control)) {
        return (
          <Button
            key={index}
            active={control.isActive()}
            config={config}
            title={control.title}
            onMouseDown={(event) => {
              event.preventDefault()
              setSubMenu(index)
            }}
          >
            {control.renderIcon()}
          </Button>
        )
      }
      return renderControlButton(control, index)
    })

    function renderControlButton(control: ControlButton, key?: number) {
      return (
        <Button
          key={key}
          active={control.isActive()}
          config={config}
          title={control.title}
          onMouseDown={(event) => {
            event.preventDefault()
            control.onClick()
          }}
        >
          {control.renderIcon()}
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
