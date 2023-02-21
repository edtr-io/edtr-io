import { useScopedStore } from '@edtr-io/core/beta'
import { replace } from '@edtr-io/store'
import React, { useState, useEffect, useRef } from 'react'

import type { TextPluginConfig } from '../types'

function mapPlugins(plugins: TextPluginConfig['registry'], text: string) {
  const search = text.replace('/', '').toLowerCase()

  const startingWithSearchString = plugins
    .filter(({ title, name }) => {
      if (!search.length) return true
      const value = title?.toLowerCase() || name.toLowerCase()
      return value.startsWith(search)
    })
    .map(({ title, name }) => [title || name, name])
  const containingSearchString = plugins
    .filter(({ title, name }) => {
      const value = title?.toLowerCase() || name.toLowerCase()
      return value.includes(search) && !value.startsWith(search)
    })
    .map(({ title, name }) => [title || name, name])

  return [...startingWithSearchString, ...containingSearchString]
}

const hotKeysMap = {
  SELECT_UP: 'up',
  SELECT_DOWN: 'down',
  INSERT: 'enter',
}

// TODO: This hook is a workaround, as new Slate plugins don't allow as
//       much flexibility with extending Slate. Might be worth to check
//       if there is a way to inject this functionality as a Slate plugin
export const useSuggestions = (args: {
  text: string
  id: string
  editable: boolean
  focused: boolean
  registry: TextPluginConfig['registry']
}) => {
  const [selected, setSelected] = useState(0)
  const store = useScopedStore()
  const { text, id, editable, focused, registry } = args

  const allOptions = mapPlugins(registry, text)
  // TODO: In case of implementing "allowed plugins" functionality for edtr-io plugins,
  //       it would be possible to add a check here if suggestions plugin is allowed
  const showSuggestions =
    editable && focused && text.startsWith('/') && allOptions.length > 0
  const options = showSuggestions ? allOptions : []
  const currentValue = text.substring(1)

  const closure = useRef({
    showSuggestions,
    selected,
    options,
  })
  closure.current = {
    showSuggestions,
    selected,
    options,
  }

  useEffect(() => {
    if (options.length < selected) {
      setSelected(0)
    }
  }, [options.length, selected])

  function insertPlugin(plugin: string) {
    store.dispatch(replace({ id, plugin }))
  }

  function handleHotkeys(event: React.KeyboardEvent) {
    if (closure.current.showSuggestions) {
      if (['ArrowDown', 'ArrowUp', 'Enter'].includes(event.key)) {
        event.preventDefault()
        return
      }
    }
  }

  const handleSelectionChange = (direction: 'up' | 'down') => () => {
    if (closure.current.showSuggestions) {
      setSelected((currentSelected) => {
        const optionsCount = closure.current.options.length
        const value = direction === 'up' ? optionsCount - 1 : 1
        if (optionsCount === 0) return 0
        return (currentSelected + value) % optionsCount
      })
    }
  }

  const handleSuggestionInsert = () => {
    if (closure.current.showSuggestions) {
      const option = closure.current.options[closure.current.selected]
      if (!option) return
      setTimeout(() => {
        insertPlugin(option[1])
      })
    }
  }

  const hotKeysHandlers = {
    SELECT_UP: handleSelectionChange('up'),
    SELECT_DOWN: handleSelectionChange('down'),
    INSERT: handleSuggestionInsert,
  }

  return {
    showSuggestions,
    suggestionsProps: {
      options,
      currentValue,
      selected,
      onMouseDown: insertPlugin,
    },
    hotKeysProps: {
      keyMap: hotKeysMap,
      handlers: hotKeysHandlers,
    },
    handleHotkeys,
  }
}
