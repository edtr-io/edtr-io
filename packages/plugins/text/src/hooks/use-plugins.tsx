import isHotkey from 'is-hotkey'
import React, { useCallback, useMemo } from 'react'
import { Editor as SlateEditor } from 'slate'

import { withLinks, withLists, withMath } from '../plugins'
import { TextPlugin } from '../types'
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
  [TextPlugin.math]: withMath,
  [TextPlugin.links]: withLinks,
  [TextPlugin.lists]: withLists,
}

const isRegisteredTextPlugin = (
  plugin: TextPlugin
): plugin is keyof typeof textPluginsMapper => {
  return plugin in textPluginsMapper
}

const registeredHotkeys = [
  {
    hotkey: 'mod+b',
    plugin: TextPlugin.richText,
    handler: toggleBoldMark,
  },
  {
    hotkey: 'mod+i',
    plugin: TextPlugin.richText,
    handler: toggleItalicMark,
  },
  {
    hotkey: 'mod+k',
    plugin: TextPlugin.links,
    handler: toggleLink,
  },
]

const createToolbarControls = (
  { i18n, theme }: TextPluginConfig,
  enabledPlugins: TextPlugin[]
): TextEditorControl[] => {
  const allControls = [
    // Bold
    {
      plugin: TextPlugin.richText,
      title: i18n.richText.toggleStrongTitle,
      isActive: isBoldActive,
      onClick: toggleBoldMark,
      renderIcon: () => <strong>B</strong>,
    },
    // Italic
    {
      plugin: TextPlugin.richText,
      title: i18n.richText.toggleEmphasizeTitle,
      isActive: isItalicActive,
      onClick: toggleItalicMark,
      renderIcon: () => <em>I</em>,
    },
    // Colors
    {
      plugin: TextPlugin.colors,
      title: i18n.colors.openMenuTitle,
      closeMenuTitle: i18n.colors.closeMenuTitle,
      isActive: isAnyColorActive,
      renderIcon: () => <span>C</span>,
      renderCloseMenuIcon: () => <span>X</span>,
      children: [
        {
          plugin: TextPlugin.colors,
          title: i18n.colors.resetColorTitle,
          isActive: (editor: SlateEditor) => !isAnyColorActive(editor),
          onClick: resetColor,
          renderIcon: () => (
            <span
              style={{ backgroundColor: theme.plugins.colors.defaultColor }}
            >
              &nbsp;
            </span>
          ),
        },
        ...theme.plugins.colors.colors.map((color, colorIndex) => ({
          plugin: TextPlugin.colors,
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
      plugin: TextPlugin.code,
      title: i18n.code.toggleTitle,
      isActive: isCodeActive,
      onClick: toggleCode,
      renderIcon: () => <code>C</code>,
    },
    // Headings
    {
      plugin: TextPlugin.headings,
      title: i18n.headings.openMenuTitle,
      closeMenuTitle: i18n.headings.closeMenuTitle,
      isActive: isAnyHeadingActive,
      renderIcon: () => <span>H</span>,
      renderCloseMenuIcon: () => <span>X</span>,
      children: theme.plugins.headings.map((heading) => ({
        plugin: TextPlugin.headings,
        title: i18n.headings.setHeadingTitle(heading),
        isActive: isHeadingActive(heading),
        onClick: toggleHeading(heading),
        renderIcon: () => <span>T{heading}</span>,
      })),
    },
    // Ordered list
    {
      plugin: TextPlugin.lists,
      title: i18n.list.toggleOrderedList,
      isActive: isOrderedListActive,
      onClick: toggleOrderedList,
      renderIcon: () => <b>1.</b>,
    },
    // Unordered list
    {
      plugin: TextPlugin.lists,
      title: i18n.list.toggleUnorderedList,
      isActive: isUnorderedListActive,
      onClick: toggleUnorderedList,
      renderIcon: () => <b>*</b>,
    },
    // Link
    {
      plugin: TextPlugin.links,
      title: i18n.link.toggleTitle,
      isActive: isLinkActive,
      onClick: toggleLink,
      renderIcon: () => <span>&#128279;</span>,
    },
    // Math
    {
      plugin: TextPlugin.math,
      title: i18n.math.toggleTitle,
      isActive: isMathActive,
      onClick: toggleMath,
      renderIcon: () => <b>M</b>,
    },
  ]

  const enabledPluginsControls = allControls.filter((control) => {
    return enabledPlugins.includes(TextPlugin[control.plugin])
  })

  return enabledPluginsControls
}

export const usePlugins = (
  config: TextPluginConfig,
  enabledPlugins: TextPlugin[]
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
