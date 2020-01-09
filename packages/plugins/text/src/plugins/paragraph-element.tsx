import * as React from 'react'
import { RenderElementProps } from 'slate-react'

import { TextEditorPlugin } from '../types'
import { createBlockElementPlugin } from './block-element'

export function createParagraphElementPlugin({
  type = 'paragraph',
  Component = Paragraph
}: {
  type?: string
  Component?: React.ComponentType<RenderElementProps>
} = {}): TextEditorPlugin {
  return createBlockElementPlugin({ type, Component }, editor => {
    editor.defaultNode = type
    return editor
  })
}

function Paragraph({ attributes, children }: RenderElementProps) {
  return <p {...attributes}>{children}</p>
}
