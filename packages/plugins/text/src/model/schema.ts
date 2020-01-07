import { ValueJSON } from 'slate'

export const paragraphNode = 'paragraph'

export const orderedListNode = 'ordered-list'
export const unorderedListNode = 'unordered-list'
export const listItemNode = 'list-item'
export const listItemChildNode = 'list-item-child'

export const linkNode = '@splish-me/a'
export const colorMark = '@splish-me/color'
export const strongMark = '@splish-me/strong'
export const emphasizeMark = '@splish-me/em'
export const katexInlineNode = '@splish-me/katex-inline'

export const katexBlockNode = '@splish-me/katex-block'

export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6

export const createHeadingNode = (level: HeadingLevel) => {
  return `@splish-me/h${level}`
}

export const defaultNode = paragraphNode

export const slateSchema = {
  inlines: {
    [katexInlineNode]: {
      isVoid: true
    },
    [linkNode]: {
      text: /.+/
    }
  },
  blocks: {
    [katexBlockNode]: {
      isVoid: true
    }
  }
}

export const emptyDocument: ValueJSON = {
  document: {
    nodes: [
      {
        object: 'block',
        type: defaultNode,
        nodes: [
          {
            object: 'text'
          }
        ]
      }
    ]
  }
}
