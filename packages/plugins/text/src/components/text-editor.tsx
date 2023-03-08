import { HotKeys } from '@edtr-io/core'
import { HoverOverlay } from '@edtr-io/editor-ui/beta'
import { EditorPluginProps } from '@edtr-io/plugin'
import React, {
  createElement,
  useRef,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { createEditor, Descendant, Node, Transforms } from 'slate'
import {
  Editable,
  RenderElementProps,
  RenderLeafProps,
  Slate,
  withReact,
} from 'slate-react'

import { useControls } from '../hooks/use-controls'
import { useSuggestions } from '../hooks/use-suggestions'
import { useTextConfig } from '../hooks/use-text-config'
import type { TextEditorConfig, TextEditorState } from '../types'
import { markdownShortcuts } from '../utils/markdown'
import { HoveringToolbar } from './hovering-toolbar'
import { LinkControls } from './link-controls'
import { MathElement } from './math-element'
import { Suggestions } from './suggestions'

/** @public */
export type TextEditorProps = EditorPluginProps<
  TextEditorState,
  TextEditorConfig
>

export function TextEditor(props: TextEditorProps) {
  const [hasSelectionChanged, setHasSelectionChanged] = useState(0)
  const { state, id, editable, focused } = props
  const { selection, value } = state.value
  const config = useTextConfig(props.config)
  const { plugins } = config
  const textControls = useControls(config)
  const { createTextEditor, toolbarControls } = textControls
  const editor = useMemo(
    () => createTextEditor(withReact(createEditor())),
    [createTextEditor]
  )
  const text = Node.string(editor)
  const suggestions = useSuggestions({ plugins, text, id, editable, focused })
  const { showSuggestions, hotKeysProps, suggestionsProps } = suggestions

  const previousValue = useRef(value)
  const previousSelection = useRef(selection)

  useEffect(() => {
    if (!selection) return

    Transforms.setSelection(editor, selection)

    if (previousValue.current !== value) {
      editor.children = value
    }
  }, [editor, selection, value])

  function handleEditorChange(newValue: Descendant[]) {
    const isAstChange = editor.operations.some(
      ({ type }) => type !== 'set_selection'
    )
    if (isAstChange) {
      previousValue.current = newValue
      state.set(
        { value: newValue, selection: editor.selection },
        ({ value }) => ({ value, selection: previousSelection.current })
      )
    }
    setHasSelectionChanged((selection) => selection + 1)
    previousSelection.current = editor.selection
  }

  function handleEditableKeyDown(event: React.KeyboardEvent) {
    suggestions.handleHotkeys(event)
    textControls.handleHotkeys(event, editor)
    markdownShortcuts().onKeyDown(event, editor)
  }

  return (
    <HotKeys {...hotKeysProps}>
      <Slate editor={editor} value={value} onChange={handleEditorChange}>
        {editable && focused && (
          <HoveringToolbar config={config} controls={toolbarControls} />
        )}

        {editable && focused && (
          <LinkControls
            hasSelectionChanged={hasSelectionChanged}
            editor={editor}
            config={config}
          />
        )}

        <Editable
          placeholder={config.placeholder}
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

function renderLeafWithConfig(config: TextEditorConfig) {
  return function renderLeaf(props: RenderLeafProps) {
    const colors = config?.theme?.controls?.colors?.colors
    const { attributes, leaf } = props
    let { children } = props

    if (leaf.strong) {
      children = <strong>{children}</strong>
    }
    if (typeof leaf.color === 'number' && Array.isArray(colors)) {
      children = (
        <span style={{ color: colors?.[leaf.color % colors.length] }}>
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
