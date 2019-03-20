import * as React from 'react'
import { Block, Editor } from 'slate'

import { defaultNode, NodeEditorProps, NodeRendererProps, TextPlugin } from '..'

export const paragraphNode = defaultNode

export const setParagraph = (editor: Editor) => {
  return editor.setBlocks(paragraphNode)
}

export interface ParagraphPluginOptions {
  EditorComponent?: React.ComponentType<NodeEditorProps>
  RenderComponent?: React.ComponentType<NodeRendererProps>
}

class DefaultEditorComponent extends React.Component<NodeEditorProps> {
  public render() {
    const { attributes, children } = this.props

    return <p {...attributes}>{children}</p>
  }
}

class DefaultRendererComponent extends React.Component<NodeRendererProps> {
  public render() {
    const { children } = this.props

    return <p>{children}</p>
  }
}

export const createParagraphPlugin = ({
  EditorComponent = DefaultEditorComponent,
  RenderComponent = DefaultRendererComponent
}: ParagraphPluginOptions = {}) => (): TextPlugin => {
  return {
    deserialize(el, next) {
      if (el.tagName.toLowerCase() === 'p') {
        return {
          object: 'block',
          type: paragraphNode,
          nodes: next(el.childNodes)
        }
      }
    },

    serialize(obj, children) {
      const block = obj as Block

      if (
        (block.object === 'block' && block.type === paragraphNode) ||
        block.type === '@splish-me/p'
      ) {
        return <RenderComponent node={obj}>{children}</RenderComponent>
      }
    },

    renderNode(props, _editor, next) {
      const block = props.node

      if (
        (block.object === 'block' && block.type === paragraphNode) ||
        block.type === '@splish-me/p'
      ) {
        return <EditorComponent {...props} />
      }

      return next()
    }
  }
}
