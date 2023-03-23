import { Editor as SlateEditor, Element, Range, Transforms } from 'slate'

export function selectionHasElement(
  predicate: (element: Element) => boolean,
  editor: SlateEditor
) {
  const { selection } = editor
  if (!selection) return false

  const [match] = Array.from(
    SlateEditor.nodes(editor, {
      at: SlateEditor.unhangRange(editor, selection),
      match: (n) =>
        !SlateEditor.isEditor(n) && Element.isElement(n) && predicate(n),
    })
  )

  return !!match
}

export function trimSelection(editor: SlateEditor) {
  const selection = editor.selection

  if (!selection) return null

  let selectedText = SlateEditor.string(editor, selection)
  const isBackwardSelection = Range.isBackward(selection)
  let anchorOffset = selection.anchor.offset
  let focusOffset = selection.focus.offset

  while (selectedText.startsWith(' ')) {
    isBackwardSelection ? focusOffset++ : anchorOffset++
    selectedText = selectedText.substring(1)
  }
  while (selectedText.endsWith(' ')) {
    isBackwardSelection ? anchorOffset-- : focusOffset--
    selectedText = selectedText.substring(0, selectedText.length - 1)
  }

  Transforms.setSelection(editor, {
    anchor: { ...selection.anchor, offset: anchorOffset },
    focus: { ...selection.focus, offset: focusOffset },
  })
}
