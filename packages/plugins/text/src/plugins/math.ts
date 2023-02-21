import { Editor as SlateEditor } from 'slate'

export const withMath = (editor: SlateEditor) => {
  const { isInline, isVoid } = editor

  editor.isInline = (element) => {
    return element.type === 'math' ? true : isInline(element)
  }

  editor.isVoid = (element) => {
    return element.type === 'math' ? true : isVoid(element)
  }

  return editor
}
