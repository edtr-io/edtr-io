import {
  edtrBold,
  edtrClose,
  edtrFormula,
  EdtrIcon,
  edtrItalic,
  edtrLink,
  edtrListBullets,
  edtrListNumbered,
  edtrText,
  faCode,
  Icon,
} from '@edtr-io/ui'
import isHotkey from 'is-hotkey'
import React, { useCallback, useMemo } from 'react'
import { Editor as SlateEditor } from 'slate'

import { HoveringToolbarColorIcon } from '../components/hovering-toolbar-color-icon'
import { HoveringToolbarColorTextIcon } from '../components/hovering-toolbar-color-text-icon'
import { withLinks, withLists, withMath } from '../plugins'
import { TextEditorControl } from '../types'
import type { ControlButton, TextEditorPluginConfig } from '../types'
import {
  getColorIndex,
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
  isAnyHeadingActive,
  isBoldActive,
  isCodeActive,
  isHeadingActive,
  isItalicActive,
  toggleBoldMark,
  toggleCode,
  toggleHeading,
  toggleItalicMark,
} from '../utils/rich-text'

type SetIsLinkNewlyCreated = (value: boolean) => void

const textPluginsMapper = {
  [TextEditorControl.math]: withMath,
  [TextEditorControl.links]: withLinks,
  [TextEditorControl.lists]: withLists,
}

const isRegisteredTextPlugin = (
  control: TextEditorControl
): control is keyof typeof textPluginsMapper => {
  return control in textPluginsMapper
}

const toggleLinkAndFlag =
  (setIsLinkNewlyCreated: SetIsLinkNewlyCreated) => (editor: SlateEditor) => {
    toggleLink(editor)
    setIsLinkNewlyCreated(true)
  }

const registeredHotkeys = (setIsLinkNewlyCreated: SetIsLinkNewlyCreated) => [
  {
    hotkey: 'mod+b',
    control: TextEditorControl.richText,
    handler: toggleBoldMark,
  },
  {
    hotkey: 'mod+i',
    control: TextEditorControl.richText,
    handler: toggleItalicMark,
  },
  {
    hotkey: 'mod+k',
    control: TextEditorControl.links,
    handler: toggleLinkAndFlag(setIsLinkNewlyCreated),
  },
  {
    hotkey: 'mod+m',
    control: TextEditorControl.math,
    handler: toggleMath,
  },
]

export const useControls = (
  config: TextEditorPluginConfig,
  setIsLinkNewlyCreated: SetIsLinkNewlyCreated
) => {
  const { controls } = config

  const createTextEditor = useCallback(
    (baseEditor: SlateEditor) =>
      controls.reduce((currentEditor, currentControl) => {
        // If there is no control initialization function for the current control,
        // return the editor as it was received
        if (!isRegisteredTextPlugin(currentControl)) {
          return currentEditor
        }
        // Otherwise, apply the control initialization functions to the editor
        return textPluginsMapper[currentControl](currentEditor)
      }, baseEditor),
    [controls]
  )

  const toolbarControls: ControlButton[] = useMemo(
    () => createToolbarControls(config, setIsLinkNewlyCreated),
    [config, setIsLinkNewlyCreated]
  )

  const handleHotkeys = useCallback(
    (event: React.KeyboardEvent, editor: SlateEditor) => {
      // Go through the registered hotkeys
      for (const { hotkey, control, handler } of registeredHotkeys(
        setIsLinkNewlyCreated
      )) {
        // Check if their respective control is enabled
        // and if the keyboard event contains the hotkey combination
        if (controls.includes(control) && isHotkey(hotkey, event)) {
          // If so, prevent the default event behavior,
          // handle the hotkey and break out of the loop
          event.preventDefault()
          handler(editor)
          break
        }
      }
    },
    [controls, setIsLinkNewlyCreated]
  )

  return {
    createTextEditor,
    toolbarControls,
    handleHotkeys,
  }
}

function createToolbarControls(
  { i18n, theme, controls }: TextEditorPluginConfig,
  setIsLinkNewlyCreated: SetIsLinkNewlyCreated
): ControlButton[] {
  const allControls = [
    // Bold
    {
      name: TextEditorControl.richText,
      title: i18n.richText.toggleStrongTitle,
      isActive: isBoldActive,
      onClick: toggleBoldMark,
      renderIcon: () => <EdtrIcon icon={edtrBold} />,
    },
    // Italic
    {
      name: TextEditorControl.richText,
      title: i18n.richText.toggleEmphasizeTitle,
      isActive: isItalicActive,
      onClick: toggleItalicMark,
      renderIcon: () => <EdtrIcon icon={edtrItalic} />,
    },
    // Link
    {
      name: TextEditorControl.links,
      title: i18n.link.toggleTitle,
      isActive: isLinkActive,
      onClick: toggleLinkAndFlag(setIsLinkNewlyCreated),
      renderIcon: () => <EdtrIcon icon={edtrLink} />,
    },
    // Headings
    {
      name: TextEditorControl.headings,
      title: i18n.headings.openMenuTitle,
      closeMenuTitle: i18n.headings.closeMenuTitle,
      isActive: isAnyHeadingActive,
      renderIcon: () => <EdtrIcon icon={edtrText} />,
      renderCloseMenuIcon: () => <EdtrIcon icon={edtrClose} />,
      children: theme.controls.headings.map((heading) => ({
        name: TextEditorControl.headings,
        title: i18n.headings.setHeadingTitle(heading),
        isActive: isHeadingActive(heading),
        onClick: toggleHeading(heading),
        renderIcon: () => <span>H{heading}</span>,
      })),
    },
    // Colors
    {
      name: TextEditorControl.colors,
      title: i18n.colors.openMenuTitle,
      closeMenuTitle: i18n.colors.closeMenuTitle,
      isActive: () => false,
      renderIcon: (editor: SlateEditor) => (
        <HoveringToolbarColorTextIcon
          index={getColorIndex(editor)}
          colorsTheme={theme.controls.colors}
        />
      ),
      renderCloseMenuIcon: () => <EdtrIcon icon={edtrClose} />,
      children: [
        {
          name: TextEditorControl.colors,
          title: i18n.colors.resetColorTitle,
          isActive: (editor: SlateEditor) => !isAnyColorActive(editor),
          onClick: resetColor,
          renderIcon: () => (
            <HoveringToolbarColorIcon
              color={theme.controls.colors.defaultColor}
            />
          ),
        },
        ...theme.controls.colors.colors.map((color, colorIndex) => ({
          name: TextEditorControl.colors,
          title: i18n.colors.colorNames[colorIndex],
          isActive: isColorActive(colorIndex),
          onClick: toggleColor(colorIndex),
          renderIcon: () => <HoveringToolbarColorIcon color={color} />,
        })),
      ],
    },
    // Ordered list
    {
      name: TextEditorControl.lists,
      title: i18n.list.toggleOrderedList,
      isActive: isOrderedListActive,
      onClick: toggleOrderedList,
      renderIcon: () => <EdtrIcon icon={edtrListNumbered} />,
    },
    // Unordered list
    {
      name: TextEditorControl.lists,
      title: i18n.list.toggleUnorderedList,
      isActive: isUnorderedListActive,
      onClick: toggleUnorderedList,
      renderIcon: () => <EdtrIcon icon={edtrListBullets} />,
    },
    // Math
    {
      name: TextEditorControl.math,
      title: i18n.math.toggleTitle,
      isActive: isMathActive,
      onClick: toggleMath,
      renderIcon: () => <EdtrIcon icon={edtrFormula} />,
    },
    // Code
    {
      name: TextEditorControl.code,
      title: i18n.code.toggleTitle,
      isActive: isCodeActive,
      onClick: toggleCode,
      renderIcon: () => <Icon icon={faCode} />,
    },
  ]

  return allControls.filter((control) =>
    controls.includes(TextEditorControl[control.name])
  )
}
