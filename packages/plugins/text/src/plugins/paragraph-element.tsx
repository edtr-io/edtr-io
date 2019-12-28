import * as React from 'react'
import { RenderElementProps } from 'slate-react'

import { Editor, TextEditorPlugin } from '../types'

function ParagraphElement({ attributes, children }: RenderElementProps) {
  return <p {...attributes}>{children}</p>
}

export function createParagraphElement({
  type = 'paragraph',
  Component = ParagraphElement
}: {
  type?: string
  Component?: React.ComponentType<RenderElementProps>
} = {}): TextEditorPlugin {
  return function(editor: Editor) {
    const { renderElement } = editor
    // eslint-disable-next-line react/display-name
    editor.renderElement = props => {
      if (props.element.type !== type) return renderElement(props)
      return <Component {...props} />
    }
    return editor
  }
}
