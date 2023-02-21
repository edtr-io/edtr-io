import { Editor as SlateEditor } from 'slate'

export const withLinks = (editor: SlateEditor) => {
  const { isInline } = editor

  editor.isInline = (element) => {
    return element.type === 'a' ? true : isInline(element)
  }

  return editor
}
