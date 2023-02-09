import { CustomTypes, Editor as SlateEditor } from 'slate'

export function isBoldActive(editor: CustomTypes['Editor']) {
  return SlateEditor.marks(editor)?.strong === true
}

export function toggleBoldMark(editor: CustomTypes['Editor']) {
  if (isBoldActive(editor)) {
    SlateEditor.removeMark(editor, 'strong')
  } else {
    SlateEditor.addMark(editor, 'strong', true)
  }
}
