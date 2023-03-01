import { useScopedStore } from '@edtr-io/core/beta'
import { replace } from '@edtr-io/store'
import React, { useState, useEffect, useRef } from 'react'

import { EditorPlugin } from '../types'

interface useSuggestionsArgs {
  plugins: EditorPlugin[]
  text: string
  id: string
  editable: boolean
  focused: boolean
}

const pluginTitleMapper: Record<EditorPlugin, string> = {
  [EditorPlugin.anchor]: 'Anchor',
  [EditorPlugin.blockquote]: 'Blockquote',
  [EditorPlugin.files]: 'Files',
  [EditorPlugin.geogebra]: 'Geogebra',
  [EditorPlugin.highlight]: 'Highlight',
  [EditorPlugin.image]: 'Image',
  [EditorPlugin.inputExercise]: 'Input Exercise',
  [EditorPlugin.multimediaExplanation]: 'Multimedia Explanation',
  [EditorPlugin.scMcExercise]: 'Single/Multiple Choice Exercise',
  [EditorPlugin.serloInjection]: 'Serlo Injection',
  [EditorPlugin.spoiler]: 'Spoiler',
  [EditorPlugin.table]: 'Table',
  [EditorPlugin.video]: 'Video',
}

function mapPlugins(plugins: EditorPlugin[], text: string) {
  const search = text.replace('/', '').toLowerCase()

  const startingWithSearchString = plugins
    .map((plugin) => ({ name: plugin, title: pluginTitleMapper[plugin] }))
    .filter(({ title }) => {
      if (!search.length) return true
      return title.toLowerCase().startsWith(search)
    })
  const containingSearchString = plugins
    .map((plugin) => ({ name: plugin, title: pluginTitleMapper[plugin] }))
    .filter(({ title }) => {
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
  const { plugins, text, id, editable, focused } = args

  const allOptions = mapPlugins(plugins, text)
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
