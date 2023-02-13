import { withListsReact } from '@prezly/slate-lists'
import isHotkey from 'is-hotkey'
import * as React from 'react'
import { createEditor, Descendant, Transforms } from 'slate'
import {
  Editable,
  RenderElementProps,
  RenderLeafProps,
  Slate,
  withReact,
} from 'slate-react'

import { useTextConfig } from '../hooks/use-text-config'
import type { TextConfig, TextProps } from '../types'
import { toggleLink } from '../utils/link'
import { markdownShortcuts } from '../utils/markdown'
import { toggleBoldMark, toggleItalicMark } from '../utils/typography'
import { withListsPlugin } from '../utils/with-lists-plugin'
import { HoveringToolbar } from './hovering-toolbar'
import { LinkControls } from './link-controls'
import { MathElement } from './math-element'

function renderElement(props: RenderElementProps) {
  const { element, attributes, children } = props

  if (element.type === 'h') {
    const level = element.level
    const headingLevel = level <= 6 && level >= 1 ? level : 6
    return React.createElement(`h${headingLevel}`, attributes, <>{children}</>)
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

  if (element.type != 'p') {
    console.log(element)
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
  const config = useTextConfig(props.config)
  const { selection, value } = props.state.value
  const previousValue = React.useRef(value)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const previousSelection = React.useRef(selection)

  const editor = React.useMemo(
    () => withListsReact(withListsPlugin(withReact(createEditor()))),
    []
  )

  editor.isInline = ({ type }) => type === 'a' || type === 'math'
  editor.isVoid = ({ type }) => type == 'math'

  React.useEffect(() => {
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
    }
  }

  function handleEditableKeyDown(event: React.KeyboardEvent) {
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
    <Slate editor={editor} value={value} onChange={handleEditorChange}>
      <HoveringToolbar config={config} />

      {props.editable && <LinkControls editor={editor} config={config} />}

      <Editable
        onKeyDown={handleEditableKeyDown}
        renderElement={renderElement}
        renderLeaf={renderLeafWithConfig(config)}
      />
    </Slate>
  )
}
