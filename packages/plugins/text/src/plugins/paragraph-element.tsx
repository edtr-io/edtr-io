import * as React from 'react'
import { RenderElementProps } from 'slate-react'

import { TextEditorPlugin } from '../types'
import { createBlockElementPlugin } from './block-element'

export function createParagraphElementPlugin({
  type = 'p',
  Component = Paragraph
}: {
  type?: string
  Component?: React.ComponentType<RenderElementProps>
} = {}): TextEditorPlugin {
  return createBlockElementPlugin({ type, Component })
}

function Paragraph({ attributes, children }: RenderElementProps) {
  return <p {...attributes}>{children}</p>
}
