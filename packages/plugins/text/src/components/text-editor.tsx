import { withListsReact } from '@prezly/slate-lists'
import isHotkey from 'is-hotkey'
import * as React from 'react'
import { createEditor, Transforms } from 'slate'
import { Editable, ReactEditor, Slate, withReact } from 'slate-react'

import { useTextConfig } from '../hooks/use-text-config'
import type { TextProps } from '../types'
import { toggleLink } from '../utils/link'
import { markdownShortcuts } from '../utils/markdown'
import { toggleBoldMark, toggleItalicMark } from '../utils/typography'
import { withListsPlugin } from '../utils/with-lists-plugin'
import { HoveringToolbar } from './hovering-toolbar'
import { LinkControls } from './link-controls'
import { MathElement } from './math-element'

export function TextEditor(props: TextProps) {
  const config = useTextConfig(props.config)
  const { selection, value } = props.state.value
  const previousValue = React.useRef(value)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const previousSelection = React.useRef(selection)

  const editor = React.useMemo(
    () =>
      withListsReact(withListsPlugin(withReact(createEditor() as ReactEditor))),
    []
  )

  editor.isInline = (element) => {
    return element.type === 'a' || element.type === 'math'
  }

  editor.isVoid = (element) => {
    return element.type == 'math'
  }

  React.useEffect(() => {
    if (!selection) return
    Transforms.setSelection(editor, selection)
  }, [editor, selection])

  // TODO: Change state + selection
  return (
    <Slate
      editor={editor}
      value={value}
      onChange={(newValue) => {
        // Only update edtr-io state when the actual content of the text plugin
        // changed
        const isAstChange = editor.operations.some(
          (op) => op.type !== 'set_selection'
        )
        if (isAstChange) {
          previousValue.current = newValue
          props.state.set({ value: newValue, selection: editor.selection })
        }
      }}
    >
      <HoveringToolbar config={config} />

      {props.editable && <LinkControls editor={editor} config={config} />}

      <Editable
        onKeyDown={(event) => {
          if (isHotkey('mod+b')(event)) {
            event.preventDefault()
            return toggleBoldMark(editor)
          }
          if (isHotkey('mod+i')(event)) {
            event.preventDefault()
            return toggleItalicMark(editor)
          }
          if (isHotkey('mod+k', event)) {
            event.preventDefault()
            return toggleLink(editor)
          }

          markdownShortcuts().onKeyDown(
            event as unknown as KeyboardEvent,
            editor
          )
        }}
        renderElement={(props) => {
          if (props.element.type === 'h') {
            const level = props.element.level
            const headingLevel = level <= 6 && level >= 1 ? level : 6
            return React.createElement(
              `h${headingLevel}`,
              props.attributes,
              <>{props.children}</>
            )
          }
          if (props.element.type === 'a') {
            return (
              <a
                href={props.element.href}
                style={{ cursor: 'pointer' }}
                {...props.attributes}
              >
                {props.children}
              </a>
            )
          }

          if (props.element.type === 'unordered-list') {
            return <ul {...props.attributes}>{props.children}</ul>
          }
          if (props.element.type === 'ordered-list') {
            return <ol {...props.attributes}>{props.children}</ol>
          }
          if (props.element.type === 'list-item') {
            return <li {...props.attributes}>{props.children}</li>
          }
          if (props.element.type === 'list-item-child') {
            return <div {...props.attributes}>{props.children}</div>
          }

          if (props.element.type === 'math') {
            return (
              <MathElement
                element={props.element}
                attributes={props.attributes}
              >
                {props.children}
              </MathElement>
            )
          }

          if (props.element.type != 'p') {
            console.log(props.element)
          }
          return <p {...props.attributes}>{props.children}</p>
        }}
        renderLeaf={({ attributes, leaf, children }) => {
          if (leaf.strong) {
            children = <strong>{children}</strong>
          }
          if (typeof leaf.color === 'number') {
            children = (
              <span
                style={{
                  color:
                    config.theme.plugins.colors.colors[
                      leaf.color % config.theme.plugins.colors.colors.length
                    ],
                }}
              >
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
        }}
      />
    </Slate>
  )
}
