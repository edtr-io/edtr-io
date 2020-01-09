import React from 'react'
import { Editor as SlateEditor, Element, Transforms } from 'slate'
import { RenderElementProps } from 'slate-react'

import { Editor } from '../types'

export function createBlockElementPlugin<E extends Element = Element>(
  {
    Component,
    type
  }: {
    Component: React.ComponentType<RenderElementProps & { element: E }>
    type: string
  },
  createPlugin: (
    editor: Editor,
    helpers: BlockElementPluginHelpers<E>
  ) => Editor = editor => editor
) {
  return function(editor: Editor) {
    const { renderElement } = editor

    // eslint-disable-next-line react/display-name
    editor.renderElement = props => {
      if (props.element.type !== type) return renderElement(props)
      return <Component {...props} element={props.element as E} />
    }

    return createPlugin(editor, {
      isActive,
      getElement,
      remove,
      set
    })

    function isActive() {
      const [match] = SlateEditor.nodes(editor, {
        match(node) {
          return node.type === type
        }
      })

      return match !== undefined
    }

    function getElement(): E | undefined {
      const [match] = SlateEditor.nodes(editor, {
        match(node) {
          return node.type === type
        }
      })
      return match && (match[0] as E)
    }

    function remove() {
      Transforms.setNodes(editor, {
        type: editor.defaultNode
      })
    }

    function set(payload: Partial<E>) {
      Transforms.setNodes(editor, {
        type,
        ...payload
      })
    }
  }
}

export interface BlockElementPluginHelpers<E extends Element = Element> {
  isActive(): boolean
  getElement(): E | undefined
  remove(): void
  set(payload: Partial<E>): void
}
