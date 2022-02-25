import { Serializer } from '@edtr-io/plugin'
import { ValueJSON } from 'slate'

/** @public */
export const serializer: Serializer<NewNode[], ValueJSON> = {
  deserialize(serialized) {
    return {
      object: 'value',
      document: {
        object: 'document',
        nodes: (serialized || []).map(deserializeNode),
      },
    } as ValueJSON

    function deserializeNode(node: NewNode) {
      if (isNewElement(node)) {
        return deserializeElement(node)
      }
      return deserializeText(node)

      function deserializeElement(element: NewElement): OldElement {
        switch (element.type) {
          case 'p': {
            const oldElement: OldParagraphElement = {
              object: 'block',
              type: 'paragraph',
              nodes: element.children.map(deserializeNode),
            }
            return oldElement
          }
          case 'h': {
            const oldElement: OldHeadingElement = {
              object: 'block',
              // The type assertion is necessary for api-extractor
              // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
              type: `@splish-me/h${element.level}` as OldHeadingElement['type'],
              nodes: element.children.map(deserializeNode),
            }
            return oldElement
          }
          case 'a': {
            const oldElement: OldLinkElement = {
              object: 'inline',
              type: '@splish-me/a',
              data: {
                href: element.href,
              },
              nodes: element.children.map(deserializeNode),
            }
            return oldElement
          }
          case 'math': {
            if (element.inline) {
              const oldElement: OldKatexInlineElement = {
                object: 'inline',
                type: '@splish-me/katex-inline',
                data: {
                  formula: element.src,
                  inline: true,
                },
                isVoid: true,
                nodes: element.children.map(deserializeNode),
              }
              return oldElement
            }
            const oldElement: OldKatexBlockElement = {
              object: 'block',
              type: '@splish-me/katex-block',
              data: {
                formula: element.src,
                inline: false,
              },
              isVoid: true,
              nodes: element.children.map(deserializeNode),
            }
            return oldElement
          }
          case 'ordered-list': {
            const oldElement: OldOrderedListElement = {
              object: 'block',
              type: 'ordered-list',
              nodes: element.children.map(deserializeNode),
            }
            return oldElement
          }
          case 'unordered-list': {
            const oldElement: OldUnorderedListElement = {
              object: 'block',
              type: 'unordered-list',
              nodes: element.children.map(deserializeNode),
            }
            return oldElement
          }
          case 'list-item': {
            const oldElement: OldListItemElement = {
              object: 'block',
              type: 'list-item',
              nodes: element.children.map(deserializeNode),
            }
            return oldElement
          }
          case 'list-item-child': {
            const oldElement: OldListItemChildElement = {
              object: 'block',
              type: 'list-item-child',
              nodes: element.children.map(deserializeNode),
            }
            return oldElement
          }
        }
      }

      function deserializeText(text: NewText): OldText {
        const marks: OldMark[] = []
        if (text.em) {
          marks.push({ object: 'mark', type: '@splish-me/em' })
        }
        if (text.strong) {
          marks.push({ object: 'mark', type: '@splish-me/strong' })
        }
        if (text.code) {
          marks.push({ object: 'mark', type: 'code' })
        }
        if (text.color !== undefined) {
          marks.push({
            object: 'mark',
            type: '@splish-me/color',
            data: { colorIndex: text.color },
          })
        }

        return {
          object: 'text',
          text: text.text,
          marks: marks,
        }
      }
    }
  },
  serialize(deserialized) {
    const nodes = removeLeaves(
      deserialized && deserialized.document
        ? (deserialized.document.nodes as OldNode[])
        : []
    )
    if (!nodes) return []
    return nodes.map(serializeNode)

    function serializeNode(node: OldNode): NewNode {
      if (node.object === 'text') {
        return serializeText(node)
      }
      return serializeElement(node)

      function serializeElement(element: OldElement): NewElement {
        switch (element.type) {
          case 'paragraph': {
            const newElement: NewParagraphElement = {
              type: 'p',
              children: element.nodes.map(serializeNode),
            }
            return newElement
          }
          case '@splish-me/h1': {
            const newElement: NewHeadingElement = {
              type: 'h',
              level: 1,
              children: element.nodes.map(serializeNode),
            }
            return newElement
          }
          case '@splish-me/h2': {
            const newElement: NewHeadingElement = {
              type: 'h',
              level: 2,
              children: element.nodes.map(serializeNode),
            }
            return newElement
          }
          case '@splish-me/h3': {
            const newElement: NewHeadingElement = {
              type: 'h',
              level: 3,
              children: element.nodes.map(serializeNode),
            }
            return newElement
          }
          case '@splish-me/h4': {
            const newElement: NewHeadingElement = {
              type: 'h',
              level: 4,
              children: element.nodes.map(serializeNode),
            }
            return newElement
          }
          case '@splish-me/h5': {
            const newElement: NewHeadingElement = {
              type: 'h',
              level: 5,
              children: element.nodes.map(serializeNode),
            }
            return newElement
          }
          case '@splish-me/h6': {
            const newElement: NewHeadingElement = {
              type: 'h',
              level: 6,
              children: element.nodes.map(serializeNode),
            }
            return newElement
          }
          case '@splish-me/a': {
            const newElement: NewLinkElement = {
              type: 'a',
              href: element.data.href,
              children: element.nodes.map(serializeNode),
            }
            return newElement
          }
          case '@splish-me/katex-block': {
            const newElement: NewMathElement = {
              type: 'math',
              src: element.data.formula,
              inline: false,
              children: element.nodes.map(serializeNode),
            }
            return newElement
          }
          case '@splish-me/katex-inline': {
            const newElement: NewMathElement = {
              type: 'math',
              src: element.data.formula,
              inline: true,
              children: element.nodes.map(serializeNode),
            }
            return newElement
          }
          case 'ordered-list': {
            const newElement: NewOrderedListElement = {
              type: 'ordered-list',
              children: element.nodes.map(serializeNode),
            }
            return newElement
          }
          case 'unordered-list': {
            const newElement: NewUnorderedListElement = {
              type: 'unordered-list',
              children: element.nodes.map(serializeNode),
            }
            return newElement
          }
          case 'list-item': {
            const newElement: NewListItemElement = {
              type: 'list-item',
              children: element.nodes.map(serializeNode),
            }
            return newElement
          }
          case 'list-item-child': {
            const newElement: NewListItemChildElement = {
              type: 'list-item-child',
              children: element.nodes.map(serializeNode),
            }
            return newElement
          }
        }
      }

      function serializeText(text: OldText): NewText {
        const newText: NewText = {
          text: text.text,
        }

        const marks = text.marks || []
        marks.forEach((mark) => {
          switch (mark.type) {
            case '@splish-me/strong':
              newText.strong = true
              return
            case '@splish-me/em':
              newText.em = true
              return
            case '@splish-me/color':
              newText.color = mark.data.colorIndex
              return
            case 'code':
              newText.code = true
              return
          }
        })

        return newText
      }
    }
  },
}

/** @public */
export interface NewText {
  text: string
  code?: boolean
  color?: number
  em?: boolean
  strong?: boolean
}

/** @public */
export interface NewParagraphElement {
  type: 'p'
  children: NewNode[]
}

/** @public */
export interface NewHeadingElement {
  type: 'h'
  level: 1 | 2 | 3 | 4 | 5 | 6
  children: NewNode[]
}

/** @public */
export interface NewLinkElement {
  type: 'a'
  href: string
  children: NewNode[]
}

/** @public */
export interface NewMathElement {
  type: 'math'
  src: string
  inline: boolean
  children: NewNode[]
}

/** @public */
export interface NewOrderedListElement {
  type: 'ordered-list'
  children: NewNode[]
}

/** @public */
export interface NewUnorderedListElement {
  type: 'unordered-list'
  children: NewNode[]
}

/** @public */
export interface NewListItemElement {
  type: 'list-item'
  children: NewNode[]
}

/** @public */
export interface NewListItemChildElement {
  type: 'list-item-child'
  children: NewNode[]
}

/** @public */
export type NewElement =
  | NewParagraphElement
  | NewHeadingElement
  | NewLinkElement
  | NewMathElement
  | NewOrderedListElement
  | NewUnorderedListElement
  | NewListItemElement
  | NewListItemChildElement
/** @public */
export type NewNode = NewText | NewElement

function isNewElement(node: NewNode): node is NewElement {
  return (node as NewElement).children !== undefined
}

/** @public */
export interface OldStrongMark {
  object: 'mark'
  type: '@splish-me/strong'
}

/** @public */
export interface OldEmphasizeMark {
  object: 'mark'
  type: '@splish-me/em'
}

/** @public */
export interface OldColorMark {
  object: 'mark'
  type: '@splish-me/color'
  data: { colorIndex: number }
}
/** @public */
export interface OldCodeMark {
  object: 'mark'
  type: 'code'
}

/** @public */
export type OldMark =
  | OldStrongMark
  | OldEmphasizeMark
  | OldColorMark
  | OldCodeMark

/** @public */
export interface OldText {
  object: 'text'
  text: string
  marks?: OldMark[]
}

/** @public */
export interface OldParagraphElement {
  object: 'block'
  type: 'paragraph'
  nodes: OldNode[]
}

/** @public */
export interface OldHeadingElement {
  object: 'block'
  type:
    | '@splish-me/h1'
    | '@splish-me/h2'
    | '@splish-me/h3'
    | '@splish-me/h4'
    | '@splish-me/h5'
    | '@splish-me/h6'
  nodes: OldNode[]
}

/** @public */
export interface OldLinkElement {
  object: 'inline'
  type: '@splish-me/a'
  data: {
    href: string
  }
  nodes: OldNode[]
}

/** @public */
export interface OldKatexInlineElement {
  object: 'inline'
  type: '@splish-me/katex-inline'
  data: {
    formula: string
    inline: true
  }
  isVoid: true
  nodes: OldNode[]
}

/** @public */
export interface OldKatexBlockElement {
  object: 'block'
  type: '@splish-me/katex-block'
  data: {
    formula: string
    inline: false
  }
  isVoid: true
  nodes: OldNode[]
}

/** @public */
export interface OldOrderedListElement {
  object: 'block'
  type: 'ordered-list'
  nodes: OldNode[]
}

/** @public */
export interface OldUnorderedListElement {
  object: 'block'
  type: 'unordered-list'
  nodes: OldNode[]
}

/** @public */
export interface OldListItemElement {
  object: 'block'
  type: 'list-item'
  nodes: OldNode[]
}

/** @public */
export interface OldListItemChildElement {
  object: 'block'
  type: 'list-item-child'
  nodes: OldNode[]
}

/** @public */
export type OldElement =
  | OldParagraphElement
  | OldHeadingElement
  | OldLinkElement
  | OldKatexInlineElement
  | OldKatexBlockElement
  | OldOrderedListElement
  | OldUnorderedListElement
  | OldListItemElement
  | OldListItemChildElement
/** @public */
export type OldNode = OldText | OldElement

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function removeLeaves(nodes: any[]) {
  if (!nodes) {
    return []
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment
  const cleanedNodes: any[] = nodes.reduce((acc, node) => {
    /* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-return */
    if (node.leaves) {
      // we don't need the node itself, as we expect it to be a text node
      return [
        ...acc,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-call
        ...node.leaves.map((leave: any) => ({
          ...leave,
          object: 'text',
        })),
      ]
    } else {
      const cleanedNode = node.nodes
        ? {
            ...node,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            nodes: removeLeaves(node.nodes as any[]),
          }
        : node
      return [...acc, cleanedNode]
    }
    /* eslint-enable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-return */
  }, [])
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return cleanedNodes
}
