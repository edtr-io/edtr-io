import { CustomTypes, Element, Range, Transforms } from 'slate'

import { selectionHasElement } from './selection'

export function isLinkActive(editor: CustomTypes['Editor']) {
  return selectionHasElement((e) => e.type === 'a', editor)
}

export function toggleLink(editor: CustomTypes['Editor']) {
  if (isLinkActive(editor)) {
    Transforms.unwrapNodes(editor, {
      match: (n) => Element.isElement(n) && n.type === 'a',
    })
  } else {
    const { selection } = editor
    const isCollapsed = selection && Range.isCollapsed(selection)

    if (isCollapsed) {
      // TODO: how set focus to input field, when it is newly created?
      Transforms.insertNodes(editor, {
        type: 'a',
        href: '',
        children: [{ text: 'link' }],
      })
    } else {
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
  }
}
