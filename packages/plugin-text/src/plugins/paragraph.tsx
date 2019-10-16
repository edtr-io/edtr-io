import { paragraphNode } from '@edtr-io/plugin-text-state'
import * as React from 'react'
import { Block, Editor } from 'slate'

import { BlockEditorProps, BlockRendererProps, TextPlugin } from '..'

export const setParagraph = (editor: Editor) => {
  return editor.setBlocks(paragraphNode)
}

export interface ParagraphPluginOptions {
  EditorComponent?: React.ComponentType<BlockEditorProps>
  RenderComponent?: React.ComponentType<BlockRendererProps>
}

class DefaultEditorComponent extends React.Component<BlockEditorProps> {
  public render() {
    const { attributes, children } = this.props

    return <div {...attributes}>{children}</div>
  }
}

class DefaultRendererComponent extends React.Component<BlockRendererProps> {
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

    renderBlock(props, _editor, next) {
      const block = props.node

      if (block.type === paragraphNode || block.type === '@splish-me/p') {
        return <EditorComponent {...props} />
      }

      return next()
    }
  }
}
