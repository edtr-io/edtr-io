import { Editor as SlateEditor, Element, Node, Range, Transforms } from 'slate'

import type { Link } from '../types'
import { selectionHasElement } from './selection'

function matchLinks(node: Node) {
  return Element.isElement(node) && node.type === 'a'
}

export function isLinkActive(editor: SlateEditor) {
  return selectionHasElement((e) => e.type === 'a', editor)
}

export function getLinkElement(editor: SlateEditor): Link | undefined {
  const [match] = Array.from(SlateEditor.nodes(editor, { match: matchLinks }))
  return match && (match[0] as Link)
}

export function toggleLink(editor: SlateEditor) {
  if (isLinkActive(editor)) {
    Transforms.unwrapNodes(editor, { match: matchLinks })
    return
  }

  const { selection } = editor
  const isCollapsed = selection && Range.isCollapsed(selection)

  if (isCollapsed) {
    // TODO: how set focus to input field, when it is newly created?
    Transforms.insertNodes(editor, {
      type: 'a',
      href: '',
      children: [{ text: 'link' }],
    })
    return
  }

  Transforms.wrapNodes(
    editor,
    {
      type: 'a',
      href: '',
      children: [],
    },
    { split: true }
  )
  Transforms.collapse(editor, { edge: 'end' })
}
