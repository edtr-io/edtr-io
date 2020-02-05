import { Range as CoreRange } from 'slate'
import { Editor } from 'slate-react'

export function trimSelection(editor: Editor) {
  // Trimm selection before applying transformation
  const selection = document.getSelection()
  if (selection) {
    let str = selection.toString()
    while (str.startsWith(' ')) {
      editor.moveStartForward(1)
      str = str.substring(1)
    }
    while (str.endsWith(' ')) {
      editor.moveEndBackward(1)
      str = str.substring(0, str.length - 1)
    }
  }
}

export function getTrimmedSelectionRange(editor: Editor) {
  // get trimmed selection, without changing editor (e.g. for checking active marks)
  const native = document.getSelection()
  let selection = editor.value.selection.toRange()
  if (native) {
    let str = native.toString()
    while (str.startsWith(' ')) {
      selection = selection.moveStartForward(1)
      str = str.substring(1)
    }
    while (str.endsWith(' ')) {
      selection = selection.moveEndBackward(1)
      str = str.substring(0, str.length - 1)
    }
  }
  return CoreRange.create(selection)
}
