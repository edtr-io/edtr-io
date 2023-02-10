import { Editor as SlateEditor, Range, Transforms, Element } from 'slate'

import { selectionHasElement } from './selection'

export function isMathActive(editor: SlateEditor) {
  return selectionHasElement((e) => e.type === 'math', editor)
}

export function toggleMath(editor: SlateEditor) {
  if (isMathActive(editor)) {
    Transforms.removeNodes(editor, {
      match: (n) => Element.isElement(n) && n.type === 'math',
    })
  } else {
    const { selection } = editor
    if (!selection) return
    const isCollapsed = Range.isCollapsed(selection)

    if (isCollapsed) {
      Transforms.insertNodes(editor, {
        type: 'math',
        src: '',
        inline: true,
        children: [],
      })
    } else {
      // TODO: Test if better solution to use api from slate
      const nativeSelection = window.getSelection()
      Transforms.insertNodes(
        editor,
        [
          {
            type: 'math',
            src: nativeSelection ? nativeSelection.toString() : '',
            inline: true,
            children: [],
          },
        ],
        { at: selection }
      )
      Transforms.move(editor, { distance: 1, reverse: true })
    }
  }
}
