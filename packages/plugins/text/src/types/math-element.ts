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
