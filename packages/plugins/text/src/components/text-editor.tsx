import { HotKeys } from '@edtr-io/core'
import { HoverOverlay } from '@edtr-io/editor-ui/beta'
import { EditorPluginProps } from '@edtr-io/plugin'
import { withListsReact } from '@prezly/slate-lists'
import isHotkey from 'is-hotkey'
import React, { createElement, useRef, useEffect, useMemo } from 'react'
import { createEditor, Descendant, Node, Transforms } from 'slate'
import {
  Editable,
  RenderElementProps,
  RenderLeafProps,
  Slate,
  withReact,
} from 'slate-react'

import { useSuggestions } from '../hooks/use-suggestions'
import { useTextConfig } from '../hooks/use-text-config'
import type { TextConfig, TextPluginState } from '../types'
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

function createTextEditor() {
  return withListsReact(withListsPlugin(withReact(createEditor())))
}

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

export function TextEditor(props: TextProps) {
  const { state, id, editable, focused } = props
  const { selection, value } = state.value
  const config = useTextConfig(props.config)
  const { registry } = config
  const editor = useMemo(createTextEditor, [])
  const text = Node.string(editor)
  const previousValue = useRef(value)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const previousSelection = useRef(selection)
  const { showSuggestions, suggestionsProps, hotKeysProps, preventHotKeys } =
    useSuggestions({ text, id, editable, focused, registry })

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
      state.set({ value: newValue, selection: editor.selection })
    } else {
      // TODO: Check why the selection was not updated in state when
      //       selection changes and if this can remain here
      state.set({ value, selection: editor.selection })
    }
  }

  function handleEditableKeyDown(event: React.KeyboardEvent) {
    preventHotKeys(event)

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
    <HotKeys {...hotKeysProps}>
      <Slate editor={editor} value={value} onChange={handleEditorChange}>
        <HoveringToolbar config={config} />

        {editable && <LinkControls editor={editor} config={config} />}

        <Editable
          onKeyDown={handleEditableKeyDown}
          renderElement={renderElement}
          renderLeaf={renderLeafWithConfig(config)}
        />
      </Slate>

      {showSuggestions && (
        <HoverOverlay position="below">
          <Suggestions config={config} {...suggestionsProps} />
        </HoverOverlay>
      )}
    </HotKeys>
  )
}
