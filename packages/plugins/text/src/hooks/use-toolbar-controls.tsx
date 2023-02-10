import { ListsEditor, ListType } from '@prezly/slate-lists'
import React from 'react'
import { Editor as SlateEditor, Range, Transforms, Element } from 'slate'

import type { TextEditorControl, TextPluginConfig } from '../types'
import { isBoldActive } from '../utils/bold'
import { isItalicActive } from '../utils/italic'
import { isLinkActive } from '../utils/link'
import { selectionHasElement } from '../utils/selection'

function isCodeActive(editor: SlateEditor) {
  return SlateEditor.marks(editor)?.code === true
}

function isAnyColorActive(editor: SlateEditor) {
  return typeof SlateEditor.marks(editor)?.color === 'number'
}

function isColorActive(editor: SlateEditor, colorIndex: number) {
  return SlateEditor.marks(editor)?.color === colorIndex
}

function isAnyHeadingActive(editor: SlateEditor) {
  return selectionHasElement((e) => e.type === 'h', editor)
}

function isHeadingActive(editor: SlateEditor, heading: number) {
  return selectionHasElement(
    (e) => e.type === 'h' && e.level === heading,
    editor
  )
}

function isOrderedListActive(editor: SlateEditor) {
  return selectionHasElement((e) => e.type === 'ordered-list', editor)
}

function isUnorderedListActive(editor: SlateEditor) {
  return selectionHasElement((e) => e.type === 'unordered-list', editor)
}

function isMathActive(editor: SlateEditor) {
  return selectionHasElement((e) => e.type === 'math', editor)
}

export const useToolbarControls = (
  editor: SlateEditor,
  config: TextPluginConfig
): TextEditorControl[] => [
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
    title: config.i18n.richText.toggleEmphasizeTitle,
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
        isActive: () => !isAnyColorActive(editor),
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
          isActive: () => isColorActive(editor, colorIndex),
          onClick: () => {
            if (isColorActive(editor, colorIndex)) {
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
    title: config.i18n.code.toggleTitle,
    isActive: isCodeActive,
    onClick: () => {
      if (isCodeActive(editor)) {
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
    renderIcon: () => <span>H</span>,
    children:
      // TODO: change to config
      [1 as const, 2 as const, 3 as const].map((heading) => {
        return {
          title: `h${heading}`,
          isActive: () => isHeadingActive(editor, heading),
          onClick: () => {
            if (isHeadingActive(editor, heading)) {
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
    title: config.i18n.list.toggleOrderedList,
    isActive: isOrderedListActive,
    onClick: () => {
      if (isOrderedListActive(editor)) {
        ListsEditor.unwrapList(editor)
      } else {
        ListsEditor.wrapInList(editor, ListType.ORDERED)
      }
    },
    renderIcon: () => <b>1. </b>,
  },
  {
    title: config.i18n.list.toggleUnorderedList,
    isActive: isUnorderedListActive,
    onClick: () => {
      if (isUnorderedListActive(editor)) {
        ListsEditor.unwrapList(editor)
      } else {
        ListsEditor.wrapInList(editor, ListType.UNORDERED)
      }
    },
    renderIcon: () => <b>* </b>,
  },
  {
    title: config.i18n.link.toggleTitle,
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
      if (isMathActive(editor)) {
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
