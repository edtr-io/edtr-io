import { ListsEditor, ListType } from '@prezly/slate-lists'
import * as R from 'ramda'
import React from 'react'
import { Editor as SlateEditor, Range, Transforms, Element } from 'slate'
import { ReactEditor, useSlate } from 'slate-react'

import { ToolbarButton } from '../components/toolbar-button'
import {
  ControlButton,
  HoveringToolbarProps,
  NestedControlButton,
  TextEditorControl,
} from '../types'
import { isBoldActive } from '../utils/bold'
import { isTouchDevice } from '../utils/is-touch-device'
import { isItalicActive } from '../utils/italic'
import { isLinkActive } from '../utils/link'
import { selectionHasElement } from '../utils/selection'
import { InlineOverlay, InlineOverlayPosition } from './inline-overlay'

const initialPosition = isTouchDevice()
  ? InlineOverlayPosition.below
  : InlineOverlayPosition.above

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

  function isCodeActive() {
    return SlateEditor.marks(editor)?.code === true
  }

  function isAnyColorActive() {
    return typeof SlateEditor.marks(editor)?.color === 'number'
  }

  function isColorActive(colorIndex: number) {
    return SlateEditor.marks(editor)?.color === colorIndex
  }

  function isAnyHeadingActive() {
    return selectionHasElement((e) => e.type === 'h', editor)
  }

  function isHeadingActive(heading: number) {
    return selectionHasElement(
      (e) => e.type === 'h' && e.level === heading,
      editor
    )
  }

  function isOrderedListActive() {
    return selectionHasElement((e) => e.type === 'ordered-list', editor)
  }

  function isUnorderedListActive() {
    return selectionHasElement((e) => e.type === 'unordered-list', editor)
  }

  function isMathActive() {
    return selectionHasElement((e) => e.type === 'math', editor)
  }

  const controls: TextEditorControl[] = [
    {
      title: config.i18n.richText.toggleStrongTitle,
      isActive: isBoldActive,
      onClick: () => {
        if (isBoldActive(editor)) {
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
        if (isItalicActive(editor)) {
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
        ...config.theme.plugins.colors.colors.map((color, colorIndex) => {
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
    {
      title: 'OrderedList',
      isActive: isOrderedListActive,
      onClick: () => {
        if (isOrderedListActive()) {
          ListsEditor.unwrapList(editor)
        } else {
          ListsEditor.wrapInList(editor, ListType.ORDERED)
        }
      },
      renderIcon: () => <b>1. </b>,
    },
    {
      title: 'UnorderedList',
      isActive: isUnorderedListActive,
      onClick: () => {
        if (isUnorderedListActive()) {
          ListsEditor.unwrapList(editor)
        } else {
          ListsEditor.wrapInList(editor, ListType.UNORDERED)
        }
      },
      renderIcon: () => <b>* </b>,
    },
    {
      title: 'Link',
      isActive: isLinkActive,
      onClick: () => {
        if (isLinkActive(editor)) {
          Transforms.unwrapNodes(editor, {
            match: (n) => Element.isElement(n) && n.type === 'a',
          })
        } else {
          const { selection } = editor
          const isCollapsed = selection && Range.isCollapsed(selection)

          if (isCollapsed) {
            // TODO: how set focus to input field, when it is newly created?
            Transforms.insertNodes(editor, {
              type: 'a',
              href: '',
              children: [{ text: 'link' }],
            })
          } else {
            Transforms.wrapNodes(
              editor,
              {
                type: 'a',
                href: '',
                children: [],
              },
              { split: true }
            )
            Transforms.collapse(editor, { edge: 'end' })
          }
        }
      },
      renderIcon: () => <span>&#128279;</span>,
    },
    {
      title: config.i18n.math.toggleTitle,
      isActive: isMathActive,
      onClick: () => {
        if (isMathActive()) {
          Transforms.removeNodes(editor, {
            match: (n) => Element.isElement(n) && n.type === 'math',
          })
        } else {
          const { selection } = editor
          if (!selection) return
          const isCollapsed = Range.isCollapsed(selection)

          if (isCollapsed) {
            Transforms.insertNodes(editor, {
              type: 'math',
              src: '',
              inline: true,
              children: [],
            })
          } else {
            // TODO: Test if better solution to use api from slate
            const nativeSelection = window.getSelection()
            Transforms.insertNodes(
              editor,
              [
                {
                  type: 'math',
                  src: nativeSelection ? nativeSelection.toString() : '',
                  inline: true,
                  children: [],
                },
              ],
              { at: selection }
            )
            Transforms.move(editor, { distance: 1, reverse: true })
          }
        }
      },
      renderIcon: () => <b>* </b>,
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
          <ToolbarButton
            key={index}
            active={control.isActive(editor)}
            theme={config.theme}
            title={control.title}
            onMouseDown={(event) => {
              event.preventDefault()
              setSubMenu(index)
            }}
          >
            {control.renderIcon()}
          </ToolbarButton>
        )
      }
      return renderControlButton(control, index)
    })

    function renderControlButton(control: ControlButton, key?: number) {
      return (
        <ToolbarButton
          key={key}
          active={control.isActive(editor)}
          theme={config.theme}
          title={control.title}
          onMouseDown={(event) => {
            event.preventDefault()
            control.onClick()
          }}
        >
          {control.renderIcon()}
        </ToolbarButton>
      )
    }
  }
}
