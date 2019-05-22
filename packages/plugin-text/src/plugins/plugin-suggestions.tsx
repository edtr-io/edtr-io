import { HoveringOverlay } from '@edtr-io/editor-ui'
import * as React from 'react'
import { HotKeys } from 'react-hotkeys'
import { Editor } from 'slate'

import { TextPlugin } from '..'
import { SlatePluginClosure } from '../factory/types'
import { SuggestionProps, Suggestions } from './suggestions'

function mapPlugins(pluginClosure: SlatePluginClosure, editor: Editor) {
  if (pluginClosure.current) {
    const plugins = pluginClosure.current.plugins
    const search = editor.value.document.text.replace('/', '')
    const pluginsStartingWithSearchString = Object.keys(plugins)
      .filter(pluginKey => {
        const plugin = plugins[pluginKey]
        if (pluginKey === name || pluginKey === 'rows') return false
        if (!search.length) return true

        return (
          plugin.title &&
          plugin.title.toLowerCase().startsWith(search.toLowerCase())
        )
      })
      .map(pluginName => [plugins[pluginName].title || pluginName, pluginName])
    const otherPluginsContainingSearchString = Object.keys(plugins)
      .filter(pluginKey => {
        const plugin = plugins[pluginKey]
        if (pluginKey === name || pluginKey === 'rows') return false

        return (
          plugin.title &&
          plugin.title.toLowerCase().includes(search.toLowerCase()) &&
          !plugin.title.toLowerCase().startsWith(search.toLowerCase())
        )
      })
      .map(pluginName => [plugins[pluginName].title || pluginName, pluginName])
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
      <HoveringOverlay position={'below'}>
        <Suggestions selected={selected} {...props} />
      </HoveringOverlay>
    </HotKeys>
  )
}
