import * as React from 'react'
import { RenderElementProps } from 'slate-react'

import { TextEditorPlugin } from '../types'

export function createParagraphElementPlugin({
  type = 'paragraph',
  Component = Paragraph
}: {
  type?: string
  Component?: React.ComponentType<RenderElementProps>
} = {}): TextEditorPlugin {
  return function(editor) {
    const { renderElement } = editor
    // eslint-disable-next-line react/display-name
    editor.renderElement = props => {
      if (props.element.type !== type) return renderElement(props)
      return <Component {...props} />
    }
    return editor
  }
}

function Paragraph({ attributes, children }: RenderElementProps) {
  return <p {...attributes}>{children}</p>
}
