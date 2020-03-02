import { HotKeys } from '@edtr-io/core'
import { replace } from '@edtr-io/store'
import * as React from 'react'
import { Editor } from 'slate-react'

import { TextPlugin } from '..'
import { SlatePluginClosure } from '../factory/types'
import { HoveringOverlay } from './hovering-overlay'
import { Suggestions } from './suggestions'

function mapPlugins(pluginClosure: SlatePluginClosure, editor: Editor) {
  if (pluginClosure.current) {
    const plugins = pluginClosure.current.config.registry
    const search = editor.value.document.text.replace('/', '')
    const pluginsStartingWithSearchString = plugins
      .filter(plugin => {
        if (!search.length) return true
        const value = plugin.title || plugin.name
        return value.toLowerCase().startsWith(search.toLowerCase())
      })
      .map(plugin => [plugin.title || plugin.name, plugin.name])
    const otherPluginsContainingSearchString = plugins
      .filter(plugin => {
        const value = plugin.title || plugin.name
        return (
          value.toLowerCase().includes(search.toLowerCase()) &&
          !value.toLowerCase().startsWith(search.toLowerCase())
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

function insertPlugin(editor: Editor, pluginClosure: SlatePluginClosure) {
  return (option: string) => {
    if (!pluginClosure.current) return
    const { id, store } = pluginClosure.current
    store.dispatch(
      replace({
        id,
        plugin: option
      })
    )
  }
}
export function pluginSuggestions(
  pluginClosure: SlatePluginClosure
): TextPlugin {
  return {
    renderEditor(props, editor, next) {
      const children = next()
      return (
        <SuggestionsBox editor={editor} pluginClosure={pluginClosure}>
          {children}
        </SuggestionsBox>
      )
    },
    onKeyDown(event, editor, next) {
      const { key } = (event as unknown) as KeyboardEvent
      if (['ArrowDown', 'ArrowUp', 'Enter'].includes(key)) {
        const { text } = editor.value.document

        if (
          text.startsWith('/') &&
          mapPlugins(pluginClosure, editor).length > 0
        ) {
          event.preventDefault()
          return
        }
      }

      return next()
    }
  }
}

function SuggestionsBox({
  children,
  editor,
  pluginClosure
}: React.PropsWithChildren<{
  editor: Editor
  pluginClosure: SlatePluginClosure
}>) {
  const [selected, setSelected] = React.useState(0)
  const { text } = editor.value.document
  const showSuggestions = !editor.readOnly && text.startsWith('/')

  const options = showSuggestions ? mapPlugins(pluginClosure, editor) : []
  const closure = React.useRef({
    showSuggestions,
    selected,
    options
  })
  closure.current = {
    showSuggestions,
    selected,
    options
  }
  React.useEffect(() => {
    if (options.length < selected) {
      setSelected(0)
    }
  }, [options.length, selected])

  if (!pluginClosure.current) return null
  const config = pluginClosure.current.config

  return (
    <HotKeys
      keyMap={{
        DEC: 'up',
        INC: 'down',
        INSERT: 'enter'
      }}
      handlers={{
        DEC: () => {
          if (closure.current.showSuggestions) {
            setSelected(currentSelected => {
              const optionsCount = closure.current.options.length
              if (optionsCount === 0) return 0
              return (currentSelected + optionsCount - 1) % optionsCount
            })
          }
        },
        INC: () => {
          if (closure.current.showSuggestions) {
            setSelected(currentSelected => {
              const optionsCount = closure.current.options.length
              if (optionsCount === 0) return 0
              return (currentSelected + 1) % optionsCount
            })
          }
        },
        INSERT: () => {
          if (closure.current.showSuggestions) {
            const option = closure.current.options[closure.current.selected]
            if (!option) return
            setTimeout(() => {
              insertPlugin(editor, pluginClosure)(option[1])
            })
          }
        }
      }}
    >
      {children}
      {showSuggestions ? (
        <HoveringOverlay position="below">
          <Suggestions
            onSelect={insertPlugin(editor, pluginClosure)}
            options={options}
            currentValue={text.substr(1)}
            selected={selected}
            config={config}
          />
        </HoveringOverlay>
      ) : null}
    </HotKeys>
  )
}
