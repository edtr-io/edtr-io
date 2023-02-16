import { HotKeys, useScopedStore } from '@edtr-io/core'
import { HoverOverlay } from '@edtr-io/editor-ui'
import { EditorPluginProps } from '@edtr-io/plugin'
import { replace } from '@edtr-io/store'
import { withListsReact } from '@prezly/slate-lists'
import isHotkey from 'is-hotkey'
import React, {
  createElement,
  useState,
  useRef,
  useEffect,
  useMemo,
} from 'react'
import { createEditor, Descendant, Node, Transforms } from 'slate'
import {
  Editable,
  RenderElementProps,
  RenderLeafProps,
  Slate,
  withReact,
} from 'slate-react'

import { useTextConfig } from '../hooks/use-text-config'
import type {
  TextConfig,
  TextPluginConfig,
  TextPluginState,
  Store,
} from '../types'
import { toggleLink } from '../utils/link'
import { markdownShortcuts } from '../utils/markdown'
import { toggleBoldMark, toggleItalicMark } from '../utils/typography'
import { withListsPlugin } from '../utils/with-lists-plugin'
import { HoveringToolbar } from './hovering-toolbar'
import { LinkControls } from './link-controls'
import { MathElement } from './math-element'
import { Suggestions } from './suggestions'

/** @public */
export type TextProps = EditorPluginProps<TextPluginState, TextConfig>

function renderElement(props: RenderElementProps) {
  const { element, attributes, children } = props

  if (element.type === 'h') {
    return createElement(`h${element.level}`, attributes, <>{children}</>)
  }
  if (element.type === 'a') {
    return (
      <a href={element.href} style={{ cursor: 'pointer' }} {...attributes}>
        {children}
      </a>
    )
  }

  if (element.type === 'unordered-list') {
    return <ul {...attributes}>{children}</ul>
  }
  if (element.type === 'ordered-list') {
    return <ol {...attributes}>{children}</ol>
  }
  if (element.type === 'list-item') {
    return <li {...attributes}>{children}</li>
  }
  if (element.type === 'list-item-child') {
    return <div {...attributes}>{children}</div>
  }

  if (element.type === 'math') {
    return (
      <MathElement element={element} attributes={attributes}>
        {children}
      </MathElement>
    )
  }

  return <p {...attributes}>{children}</p>
}

function renderLeafWithConfig(config: TextConfig) {
  return function renderLeaf(props: RenderLeafProps) {
    const colors = config?.theme?.plugins?.colors?.colors
    const { attributes, leaf } = props
    let { children } = props

    if (leaf.strong) {
      children = <strong>{children}</strong>
    }
    if (typeof leaf.color === 'number') {
      children = (
        <span style={{ color: colors?.[leaf.color % colors?.length] }}>
          {children}
        </span>
      )
    }
    if (leaf.code) {
      children = <code>{children}</code>
    }
    if (leaf.em) {
      children = <em>{children}</em>
    }
    return <span {...attributes}>{children}</span>
  }
}

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

function insertPlugin(store: Store, id: string) {
  return (plugin: string) => {
    store.dispatch(replace({ id, plugin }))
  }
}

export function TextEditor(props: TextProps) {
  const [selected, setSelected] = useState(0)

  const config = useTextConfig(props.config)
  const plugins = config.registry
  const { selection, value } = props.state.value
  const previousValue = useRef(value)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const previousSelection = useRef(selection)

  const editor = useMemo(
    () => withListsReact(withListsPlugin(withReact(createEditor()))),
    []
  )

  const store = useScopedStore()

  const text = Node.string(editor)
  const allOptions = mapPlugins(plugins, text)
  const showSuggestions =
    props.editable &&
    props.focused &&
    text.startsWith('/') &&
    allOptions.length > 0
  const options = showSuggestions ? allOptions : []

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

  editor.isInline = ({ type }) => type === 'a' || type === 'math'
  editor.isVoid = ({ type }) => type == 'math'

  useEffect(() => {
    if (!selection) return
    Transforms.setSelection(editor, selection)
  }, [editor, selection])

  function handleEditorChange(newValue: Descendant[]) {
    // Only update edtr-io state when the actual content of the text plugin
    // changed
    const isAstChange = editor.operations.some(
      (op) => op.type !== 'set_selection'
    )
    if (isAstChange) {
      previousValue.current = newValue
      props.state.set({ value: newValue, selection: editor.selection })
    } else {
      // TODO: Check why the selection was not updated in state when
      //       selection changes and if this can remain here
      props.state.set({ value, selection: editor.selection })
    }
  }

  function handleEditableKeyDown(event: React.KeyboardEvent) {
    if (['ArrowDown', 'ArrowUp', 'Enter'].includes(event.key)) {
      if (text.startsWith('/') && mapPlugins(plugins, text).length > 0) {
        event.preventDefault()
        return
      }
    }

    if (isHotkey('mod+b', event)) {
      event.preventDefault()
      return toggleBoldMark(editor)
    }
    if (isHotkey('mod+i', event)) {
      event.preventDefault()
      return toggleItalicMark(editor)
    }
    if (isHotkey('mod+k', event)) {
      event.preventDefault()
      return toggleLink(editor)
    }

    markdownShortcuts().onKeyDown(event as unknown as KeyboardEvent, editor)
  }

  // TODO: Change state + selection
  return (
    <HotKeys
      keyMap={{
        DEC: 'up',
        INC: 'down',
        INSERT: 'enter',
      }}
      handlers={{
        DEC: () => {
          if (closure.current.showSuggestions) {
            setSelected((currentSelected) => {
              const optionsCount = closure.current.options.length
              if (optionsCount === 0) return 0
              return (currentSelected + optionsCount - 1) % optionsCount
            })
          }
        },
        INC: () => {
          if (closure.current.showSuggestions) {
            setSelected((currentSelected) => {
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
              insertPlugin(store, props.id)(option[1])
            })
          }
        },
      }}
    >
      <Slate editor={editor} value={value} onChange={handleEditorChange}>
        <HoveringToolbar config={config} />

        {props.editable && <LinkControls editor={editor} config={config} />}

        <Editable
          onKeyDown={handleEditableKeyDown}
          renderElement={renderElement}
          renderLeaf={renderLeafWithConfig(config)}
        />
      </Slate>
      {showSuggestions && (
        <HoverOverlay position="below">
          <Suggestions
            onSelect={insertPlugin(store, props.id)}
            options={options}
            currentValue={text.substring(1)}
            selected={selected}
            config={config}
          />
        </HoverOverlay>
      )}
    </HotKeys>
  )
}
