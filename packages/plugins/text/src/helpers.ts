import { Editor, Range, Text, Transforms } from 'slate'

export function isCollapsed(editor: Editor) {
  return editor.selection && Range.isCollapsed(editor.selection)
}

export function isMarkActive(editor: Editor, mark: string) {
  const [match] = Editor.nodes(editor, {
    match(node) {
      return node[mark]
    }
  })
  return Boolean(match)
}

export function toggleMark(editor: Editor, mark: string) {
  if (isCollapsed(editor)) return
  const isActive = isMarkActive(editor, mark)
  Transforms.setNodes(
    editor,
    { [mark]: isActive ? null : true },
    {
      match(node) {
        return Text.isText(node)
      },
      split: true
    }
  )
}
