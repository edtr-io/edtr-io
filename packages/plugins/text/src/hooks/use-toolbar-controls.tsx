import React from 'react'

import type { TextEditorControl, TextPluginConfig } from '../types'
import {
  isAnyColorActive,
  isColorActive,
  resetColor,
  toggleColor,
} from '../utils/color'
import { isLinkActive, toggleLink } from '../utils/link'
import {
  isOrderedListActive,
  isUnorderedListActive,
  toggleOrderedList,
  toggleUnorderedList,
} from '../utils/list'
import { isMathActive, toggleMath } from '../utils/math'
import {
  isBoldActive,
  toggleBoldMark,
  isItalicActive,
  toggleItalicMark,
  isCodeActive,
  toggleCode,
  isAnyHeadingActive,
  isHeadingActive,
  toggleHeading,
} from '../utils/typography'

export const useToolbarControls = ({
  i18n,
  theme,
}: TextPluginConfig): TextEditorControl[] => [
  // Bold
  {
    title: i18n.richText.toggleStrongTitle,
    isActive: isBoldActive,
    onClick: toggleBoldMark,
    renderIcon: () => <strong>B</strong>,
  },
  // Italic
  {
    title: i18n.richText.toggleEmphasizeTitle,
    isActive: isItalicActive,
    onClick: toggleItalicMark,
    renderIcon: () => <em>I</em>,
  },
  // Colors
  {
    title: i18n.colors.openMenuTitle,
    closeMenuTitle: i18n.colors.closeMenuTitle,
    isActive: isAnyColorActive,
    renderIcon: () => <span>C</span>,
    renderCloseMenuIcon: () => <span>X</span>,
    children: [
      {
        title: i18n.colors.resetColorTitle,
        isActive: (editor) => !isAnyColorActive(editor),
        onClick: resetColor,
        renderIcon: () => (
          <span style={{ backgroundColor: theme.plugins.colors.defaultColor }}>
            &nbsp;
          </span>
        ),
      },
      ...theme.plugins.colors.colors.map((color, colorIndex) => ({
        title: i18n.colors.colorNames[colorIndex],
        isActive: isColorActive(colorIndex),
        onClick: toggleColor(colorIndex),
        renderIcon: () => (
          <span style={{ backgroundColor: color }}>&nbsp;</span>
        ),
      })),
    ],
  },
  // Code
  {
    title: i18n.code.toggleTitle,
    isActive: isCodeActive,
    onClick: toggleCode,
    renderIcon: () => <code>C</code>,
  },
  // Headings
  {
    title: i18n.headings.openMenuTitle,
    closeMenuTitle: i18n.headings.closeMenuTitle,
    isActive: isAnyHeadingActive,
    renderIcon: () => <span>H</span>,
    renderCloseMenuIcon: () => <span>X</span>,
    children: theme.plugins.headings.map((heading) => ({
      title: i18n.headings.setHeadingTitle(heading),
      isActive: isHeadingActive(heading),
      onClick: toggleHeading(heading),
      renderIcon: () => <span>T{heading}</span>,
    })),
  },
  // Ordered list
  {
    title: i18n.list.toggleOrderedList,
    isActive: isOrderedListActive,
    onClick: toggleOrderedList,
    renderIcon: () => <b>1.</b>,
  },
  // Unordered list
  {
    title: i18n.list.toggleUnorderedList,
    isActive: isUnorderedListActive,
    onClick: toggleUnorderedList,
    renderIcon: () => <b>*</b>,
  },
  // Link
  {
    title: i18n.link.toggleTitle,
    isActive: isLinkActive,
    onClick: toggleLink,
    renderIcon: () => <span>&#128279;</span>,
  },
  // Math
  {
    title: i18n.math.toggleTitle,
    isActive: isMathActive,
    onClick: toggleMath,
    renderIcon: () => <b>M</b>,
  },
]
