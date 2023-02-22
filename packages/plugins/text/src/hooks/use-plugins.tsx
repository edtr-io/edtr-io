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
import { TextEditorPlugin } from '../types'
import type { TextEditorControl, TextEditorPluginConfig } from '../types'
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
} from '../utils/typography'

const textPluginsMapper = {
  [TextEditorPlugin.math]: withMath,
  [TextEditorPlugin.links]: withLinks,
  [TextEditorPlugin.lists]: withLists,
}

const isRegisteredTextPlugin = (
  plugin: TextEditorPlugin
): plugin is keyof typeof textPluginsMapper => {
  return plugin in textPluginsMapper
}

const registeredHotkeys = [
  {
    hotkey: 'mod+b',
    plugin: TextEditorPlugin.richText,
    handler: toggleBoldMark,
  },
  {
    hotkey: 'mod+i',
    plugin: TextEditorPlugin.richText,
    handler: toggleItalicMark,
  },
  {
    hotkey: 'mod+k',
    plugin: TextEditorPlugin.links,
    handler: toggleLink,
  },
]

const createToolbarControls = (
  { i18n, theme }: TextEditorPluginConfig,
  enabledPlugins: TextEditorPlugin[]
): TextEditorControl[] => {
  const allControls = [
    // Bold
    {
      plugin: TextEditorPlugin.richText,
      title: i18n.richText.toggleStrongTitle,
      isActive: isBoldActive,
      onClick: toggleBoldMark,
      renderIcon: () => <EdtrIcon icon={edtrBold} />,
    },
    // Italic
    {
      plugin: TextEditorPlugin.richText,
      title: i18n.richText.toggleEmphasizeTitle,
      isActive: isItalicActive,
      onClick: toggleItalicMark,
      renderIcon: () => <EdtrIcon icon={edtrItalic} />,
    },
    // Link
    {
      plugin: TextEditorPlugin.links,
      title: i18n.link.toggleTitle,
      isActive: isLinkActive,
      onClick: toggleLink,
      renderIcon: () => <EdtrIcon icon={edtrLink} />,
    },
    // Headings
    {
      plugin: TextEditorPlugin.headings,
      title: i18n.headings.openMenuTitle,
      closeMenuTitle: i18n.headings.closeMenuTitle,
      isActive: isAnyHeadingActive,
      renderIcon: () => <EdtrIcon icon={edtrText} />,
      renderCloseMenuIcon: () => <EdtrIcon icon={edtrClose} />,
      children: theme.plugins.headings.map((heading) => ({
        plugin: TextEditorPlugin.headings,
        title: i18n.headings.setHeadingTitle(heading),
        isActive: isHeadingActive(heading),
        onClick: toggleHeading(heading),
        renderIcon: () => <span>H{heading}</span>,
      })),
    },
    // Colors
    {
      plugin: TextEditorPlugin.colors,
      title: i18n.colors.openMenuTitle,
      closeMenuTitle: i18n.colors.closeMenuTitle,
      isActive: () => false,
      renderIcon: (editor: SlateEditor) => (
        <HoveringToolbarColorTextIcon
          index={getColorIndex(editor)}
          colorsTheme={theme.plugins.colors}
        />
      ),
      renderCloseMenuIcon: () => <EdtrIcon icon={edtrClose} />,
      children: [
        {
          plugin: TextEditorPlugin.colors,
          title: i18n.colors.resetColorTitle,
          isActive: (editor: SlateEditor) => !isAnyColorActive(editor),
          onClick: resetColor,
          renderIcon: () => (
            <HoveringToolbarColorIcon
              color={theme.plugins.colors.defaultColor}
            />
          ),
        },
        ...theme.plugins.colors.colors.map((color, colorIndex) => ({
          plugin: TextEditorPlugin.colors,
          title: i18n.colors.colorNames[colorIndex],
          isActive: isColorActive(colorIndex),
          onClick: toggleColor(colorIndex),
          renderIcon: () => <HoveringToolbarColorIcon color={color} />,
        })),
      ],
    },
    // Ordered list
    {
      plugin: TextEditorPlugin.lists,
      title: i18n.list.toggleOrderedList,
      isActive: isOrderedListActive,
      onClick: toggleOrderedList,
      renderIcon: () => <EdtrIcon icon={edtrListNumbered} />,
    },
    // Unordered list
    {
      plugin: TextEditorPlugin.lists,
      title: i18n.list.toggleUnorderedList,
      isActive: isUnorderedListActive,
      onClick: toggleUnorderedList,
      renderIcon: () => <EdtrIcon icon={edtrListBullets} />,
    },
    // Math
    {
      plugin: TextEditorPlugin.math,
      title: i18n.math.toggleTitle,
      isActive: isMathActive,
      onClick: toggleMath,
      renderIcon: () => <EdtrIcon icon={edtrFormula} />,
    },
    // Code
    {
      plugin: TextEditorPlugin.code,
      title: i18n.code.toggleTitle,
      isActive: isCodeActive,
      onClick: toggleCode,
      renderIcon: () => <Icon icon={faCode} />,
    },
  ]

  const enabledPluginsControls = allControls.filter((control) => {
    return enabledPlugins.includes(TextEditorPlugin[control.plugin])
  })

  return enabledPluginsControls
}

export const usePlugins = (
  config: TextEditorPluginConfig,
  enabledPlugins: TextEditorPlugin[]
) => {
  const createTextEditor = useCallback(
    (baseEditor: SlateEditor) =>
      enabledPlugins.reduce((currentEditor, currentPlugin) => {
        // If there is no plugin initialization function for the current plugin,
        // return the editor as it was received
        if (!isRegisteredTextPlugin(currentPlugin)) {
          return currentEditor
        }
        // Otherwise, apply the plugin initialization functions to the editor
        return textPluginsMapper[currentPlugin](currentEditor)
      }, baseEditor),
    [enabledPlugins]
  )

  const toolbarControls: TextEditorControl[] = useMemo(
    () => createToolbarControls(config, enabledPlugins),
    [config, enabledPlugins]
  )

  const handleHotkeys = useCallback(
    (event: React.KeyboardEvent, editor: SlateEditor) => {
      // Go through the registered hotkeys
      for (const { hotkey, plugin, handler } of registeredHotkeys) {
        // Check if their respective plugin is enabled
        // and if the keyboard event contains the hotkey combination
        if (enabledPlugins.includes(plugin) && isHotkey(hotkey, event)) {
          // If so, prevent the default event behavior,
          // handle the hotkey and break out of the loop
          event.preventDefault()
          handler(editor)
          break
        }
      }
    },
    [enabledPlugins]
  )

  return {
    createTextEditor,
    toolbarControls,
    handleHotkeys,
  }
}
