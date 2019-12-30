import React from 'react'
import { Editor as SlateEditor, Text, Transforms } from 'slate'

import { isCollapsed } from '../helpers'
import { Editor } from '../types'

export function createMarkPlugin<T>(
  {
    Component,
    type
  }: {
    Component: React.ComponentType<{ value: T; children: React.ReactNode }>
    type: string
  },
  createPlugin: (
    editor: Editor,
    helpers: MarkPluginsHelpers<T>
  ) => Editor = editor => editor
) {
  return function(editor: Editor) {
    const { renderLeaf } = editor

    editor.renderLeaf = props => {
      if (props.leaf[type] === undefined) return renderLeaf(props)
      const value: T = props.leaf[type]
      const children = <Component value={value}>{props.children}</Component>
      return renderLeaf({ ...props, children })
    }

    return createPlugin(editor, {
      getValue,
      isActive,
      remove,
      toggle
    })

    function getValue() {
      const [match] = SlateEditor.nodes(editor, {
        match(node) {
          return node[type] !== undefined
        }
      })

      return match && match[0][type]
    }

    function isActive(value?: T) {
      const [match] = SlateEditor.nodes(editor, {
        match(node) {
          return node[type] !== undefined
        }
      })

      return (
        match !== undefined && (value === undefined || match[0][type] === value)
      )
    }

    function remove() {
      Transforms.setNodes(
        editor,
        { [type]: null },
        {
          match(node) {
            return Text.isText(node)
          },
          split: true
        }
      )
    }

    function toggle(value: T) {
      if (isCollapsed(editor)) return
      const active = isActive(value)
      Transforms.setNodes(
        editor,
        { [type]: active ? null : value },
        {
          match(node) {
            return Text.isText(node)
          },
          split: true
        }
      )
    }
  }
}

export interface MarkPluginsHelpers<T> {
  isActive(value?: T): boolean
  getValue(): T | undefined
  remove(): void
  toggle(value: T): void
}
