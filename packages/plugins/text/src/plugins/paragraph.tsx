import * as React from 'react'
import { Editor } from 'slate-react'

import { BlockEditorProps, BlockRendererProps, TextPlugin } from '..'
import { paragraphNode } from '../model'

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
