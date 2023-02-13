import { Editor as SlateEditor, Element } from 'slate'

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
