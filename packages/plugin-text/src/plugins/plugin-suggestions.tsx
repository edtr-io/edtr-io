import { HoveringOverlay } from '@edtr-io/editor-ui'
import * as React from 'react'
import { HotKeys } from 'react-hotkeys'
import { Editor } from 'slate'

import { SlatePluginClosure } from '../factory/types'
import { SuggestionProps, Suggestions } from './suggestions'
import { TextPlugin } from '..'

function mapPlugins(pluginClosure: SlatePluginClosure, editor: Editor) {
  if (pluginClosure.current) {
    const plugins = pluginClosure.current.availablePlugins
    const search = editor.value.document.text.replace('/', '')
    const pluginsStartingWithSearchString = plugins
      .filter(plugin => {
        if (plugin.name === name || plugin.name === 'rows') return false
        if (!search.length) return true

        return (
          plugin.title &&
          plugin.title.toLowerCase().startsWith(search.toLowerCase())
        )
      })
      .map(plugin => [plugin.title || plugin.name, plugin.name])
    const otherPluginsContainingSearchString = plugins
      .filter(plugin => {
        if (plugin.name === name || plugin.name === 'rows') return false

        return (
          plugin.title &&
          plugin.title.toLowerCase().includes(search.toLowerCase()) &&
          !plugin.title.toLowerCase().startsWith(search.toLowerCase())
        )
      })
      .map(plugin => [plugin.title || plugin.name, plugin.name])
    return [
      ...pluginsStartingWithSearchString,
      ...otherPluginsContainingSearchString
    ]
  }
  return []
}

function insertPlugin(editor: Editor) {
  return (option: string) => {
    editor.command('replaceWithPlugin', {
      plugin: option
    })
  }
}
export function pluginSuggestions(
  pluginClosure: SlatePluginClosure
): TextPlugin {
  return {
    renderEditor(props, editor, next) {
      const { text } = editor.value.document

      if (!editor.readOnly && text.startsWith('/')) {
        const mappedPlugins = mapPlugins(pluginClosure, editor)
        return (
          <SuggestionsBox
            onSelect={insertPlugin(editor)}
            options={mappedPlugins}
            currentValue={text.substr(1)}
            name={pluginClosure.current ? pluginClosure.current.name : ''}
          >
            {next()}
          </SuggestionsBox>
        )
      }

      return next()
    },
    onKeyDown(event, editor, next) {
      const { text } = editor.value.document

      if (
        text.startsWith('/') &&
        mapPlugins(pluginClosure, editor).length > 0
      ) {
        const { key } = (event as unknown) as KeyboardEvent
        if (['ArrowDown', 'ArrowUp', 'Enter'].includes(key)) {
          event.preventDefault()
          return
        }
      }

      next()
    }
  }
}

function SuggestionsBox({
  children,
  ...props
}: SuggestionProps & {
  children: React.ReactNode
}) {
  const [selected, setSelected] = React.useState(0)
  const optionsCount = props.options.length

  return (
    <HotKeys
      keyMap={{
        DEC: 'up',
        INC: 'down',
        INSERT: 'enter'
      }}
      handlers={{
        DEC: () => {
          setSelected((selected + optionsCount - 1) % optionsCount)
        },
        INC: () => {
          setSelected((selected + 1) % optionsCount)
        },
        INSERT: () => {
          const option = props.options[selected]
          if (!option) return
          setTimeout(() => {
            props.onSelect(option[1])
          })
        }
      }}
    >
      {children}
      <HoveringOverlay position="below">
        <Suggestions selected={selected} {...props} />
      </HoveringOverlay>
    </HotKeys>
  )
}
