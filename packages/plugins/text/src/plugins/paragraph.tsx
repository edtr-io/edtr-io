import * as React from 'react'
import { Editor } from 'slate'

import { paragraphNode } from '../model'

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

// class DefaultRendererComponent extends React.Component<BlockRendererProps> {
//   public render() {
//     const { children } = this.props

//     return <p>{children}</p>
//   }
// }

export const createParagraphPlugin = ({
  EditorComponent = DefaultEditorComponent
}: ParagraphPluginOptions = {}) => (): TextPlugin => {
  return {
    renderBlock(props, _editor, next) {
      const block = props.node

      if (block.type === paragraphNode || block.type === '@splish-me/p') {
        return <EditorComponent {...props} />
      }

      return next()
    }
  }
}
