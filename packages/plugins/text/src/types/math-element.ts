import { RenderElementProps } from 'slate-react'

export interface MathElementProps {
  element: MathElement
  attributes: RenderElementProps['attributes']
  children: RenderElementProps['children']
}

// TODO: Good structure
export interface MathElement {
  type: 'math'
  src: string
  inline: boolean
  children: []
}

export interface TransformOutOfElementProps {
  reverse?: boolean
  shouldDelete?: boolean
}
