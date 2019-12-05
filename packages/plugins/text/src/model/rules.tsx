import * as React from 'react'
import { Data } from 'slate'
import { Rule } from 'slate-html-serializer'

import {
  paragraphNode,
  strongMark,
  emphasizeMark,
  linkNode,
  createHeadingNode,
  HeadingLevel,
  unorderedListNode,
  orderedListNode,
  listItemNode,
  listItemChildNode,
  katexBlockNode,
  katexInlineNode,
  colorMark
} from './schema'

export const rules: Rule[] = [
  // text
  {
    serialize(obj, children) {
      if (obj.object === 'string') {
        // our state should contain no newline characters
        return children.replace(new RegExp('\\r|\\n', 'g'), '')
      }
    },

    deserialize(el) {
      if (el.tagName && el.tagName.toLowerCase() === 'br') {
        return null
      }

      if (el.nodeName === '#text') {
        if (el.nodeValue && /<!--.*?-->/.exec(el.nodeValue)) return

        const text = el.nodeValue ? el.nodeValue : ''

        // sanitize spurious newlines (and whitespace?)
        return {
          object: 'text',
          text: text.replace(new RegExp('\\r|\\n|\\t', 'g'), ''),
          marks: []
        }
      }
    }
  },
  // paragraph
  {
    serialize(obj, children) {
      const block = obj

      if (
        block.object === 'block' &&
        (block.type === paragraphNode || block.type === '@splish-me/p')
      ) {
        return <p>{children}</p>
      }
    },

    deserialize(el, next) {
      if (el.tagName.toLowerCase() === 'p') {
        return {
          object: 'block',
          type: paragraphNode,
          nodes: next(el.childNodes)
        }
      }
    }
  },
  // rich text
  {
    serialize(obj, children) {
      const mark = obj
      if (mark.object === 'mark') {
        switch (mark.type) {
          case strongMark:
            return <strong>{children}</strong>
          case emphasizeMark:
            return <em>{children}</em>
          default:
            return <>{children}</>
        }
      }
    },

    deserialize(el, next) {
      switch (el.tagName.toLowerCase()) {
        case 'strong':
        case 'b':
          return {
            object: 'mark',
            type: strongMark,
            nodes: next(el.childNodes)
          }
        case 'em':
        case 'i':
          return {
            object: 'mark',
            type: emphasizeMark,
            nodes: next(el.childNodes)
          }
        default:
          return
      }
    }
  },
  // link
  {
    serialize(obj, children) {
      const block = obj

      if (block.object === 'inline' && block.type === linkNode) {
        const { data } = block

        if (!data) {
          return null
        }

        return <a href={data.get('href')}>{children}</a>
      }
    },

    deserialize(el, next) {
      if (el.tagName.toLowerCase() === 'a') {
        const href = el.getAttribute('href')

        return {
          object: 'inline',
          type: linkNode,
          nodes: next(el.childNodes),
          data: Data.create({
            href: href ? href : ''
          })
        }
      }
    }
  },
  // headings
  {
    serialize(obj, children) {
      const block = obj

      if (block.object === 'block') {
        for (let i = 1; i <= 6; i++) {
          const headingNode = createHeadingNode(i as HeadingLevel)
          if (block.type === headingNode) {
            return React.createElement(`h${i}`, {}, children)
          }
        }
      }
    },

    deserialize(el, next) {
      const match = /h([1-6])/.exec(el.tagName.toLowerCase())

      if (match) {
        const level = parseInt(match[1], 10) as HeadingLevel

        console.log('create heading', level)

        return {
          object: 'block',
          type: createHeadingNode(level),
          nodes: next(el.childNodes)
        }
      }
    }
  },
  // lists
  {
    serialize(obj, children) {
      const block = obj
      if (block.object === 'block') {
        switch (block.type) {
          case unorderedListNode:
            return <ul>{children}</ul>
          case orderedListNode:
            return <ol>{children}</ol>
          case listItemNode:
            return <li>{children}</li>
          case listItemChildNode:
            return <>{children}</>
        }
      }
    },

    deserialize(el, next) {
      switch (el.tagName.toLowerCase()) {
        case 'ol':
          return {
            object: 'block',
            type: orderedListNode,
            nodes: next(el.childNodes)
          }
        case 'ul':
          return {
            object: 'block',
            type: unorderedListNode,
            nodes: next(el.childNodes)
          }
        case 'li':
          return {
            object: 'block',
            type: listItemNode,
            nodes: [
              {
                object: 'block',
                type: listItemChildNode,
                nodes: next(el.childNodes)
              }
            ]
          }
      }
    }
  },
  // edtr-io specific: katex
  {
    serialize(obj, _children) {
      const block = obj

      if (block.object === 'block' && block.type === katexBlockNode) {
        // @ts-ignore, custom tag
        return <katexblock>{block.data.get('formula')}</katexblock>
      }

      const inline = obj

      if (inline.object === 'inline' && inline.type === katexInlineNode) {
        // @ts-ignore, custom tag
        return <katexinline>{block.data.get('formula')}</katexinline>
      }
    },

    deserialize(el, next) {
      switch (el.tagName.toLowerCase()) {
        case 'katexblock':
          return {
            object: 'block',
            type: katexBlockNode,
            data: {
              formula: el.childNodes[0].nodeValue,
              inline: false
            },
            nodes: next(el.childNodes)
          }
        case 'katexinline':
          return {
            object: 'inline',
            type: katexInlineNode,
            data: {
              formula: el.childNodes[0].nodeValue,
              inline: true
            },
            nodes: next(el.childNodes)
          }
        default:
          return
      }
    }
  },
  // edtr-io specific: color
  {
    serialize(obj, children) {
      const mark = obj
      if (mark.object === 'mark' && mark.type === colorMark) {
        const colorIndex = mark.data.get('colorIndex')
        // @ts-ignore, custom tag
        return <color index={colorIndex}>{children}</color>
      }
    },

    deserialize(el, next) {
      if (el.tagName.toLowerCase() === 'color') {
        const colorIndex = el.getAttribute('index')

        return {
          object: 'mark',
          type: linkNode,
          nodes: next(el.childNodes),
          data: Data.create({
            colorIndex: parseInt(colorIndex ? colorIndex : '')
          })
        }
      }
    }
  }
]
