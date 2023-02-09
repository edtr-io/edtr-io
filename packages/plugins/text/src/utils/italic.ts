import { CustomTypes, Editor as SlateEditor } from 'slate'

export function isItalicActive(editor: CustomTypes['Editor']) {
  return SlateEditor.marks(editor)?.em === true
}

export function toggleItalicMark(editor: CustomTypes['Editor']) {
  if (isItalicActive(editor)) {
    SlateEditor.removeMark(editor, 'em')
  } else {
    SlateEditor.addMark(editor, 'em', true)
  }
}
