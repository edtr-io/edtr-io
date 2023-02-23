import { useScopedStore } from '@edtr-io/core/beta'
import { replace } from '@edtr-io/store'
import React, { useState, useEffect, useRef } from 'react'

import { Plugin } from '../types'

interface useSuggestionsArgs {
  text: string
  id: string
  editable: boolean
  focused: boolean
}

const plugins: Plugin[] = [
  { name: 'anchor', title: 'Anchor' },
  { name: 'blockquote', title: 'Blockquote' },
  { name: 'files', title: 'Files' },
  { name: 'geogebra', title: 'Geogebra' },
  { name: 'highlight', title: 'Highlight' },
  { name: 'image', title: 'Image' },
  { name: 'inputExercise', title: 'Input Exercise' },
  { name: 'multimediaExplanation', title: 'Multimedia Explanation' },
  { name: 'scMcExercise', title: 'Single/Multiple Choice Exercise' },
  { name: 'serloInjection', title: 'Serlo Injection' },
  { name: 'spoiler', title: 'Spoiler' },
  { name: 'table', title: 'Table' },
  { name: 'video', title: 'Video' },
]

function mapPlugins(text: string) {
  const search = text.replace('/', '').toLowerCase()

  const startingWithSearchString = plugins.filter(({ title }) => {
    if (!search.length) return true
    return title.toLowerCase().startsWith(search)
  })
  const containingSearchString = plugins.filter(({ title }) => {
    const value = title.toLowerCase()
    return value.includes(search) && !value.startsWith(search)
  })

  return [...startingWithSearchString, ...containingSearchString]
}

const hotKeysMap = {
  SELECT_UP: 'up',
  SELECT_DOWN: 'down',
  INSERT: 'enter',
}

export const useSuggestions = (args: useSuggestionsArgs) => {
  const [selected, setSelected] = useState(0)
  const store = useScopedStore()
  const { text, id, editable, focused } = args

  const allOptions = mapPlugins(text)
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
        insertPlugin(option.name)
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
