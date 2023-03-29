import { Editor as SlateEditor, Transforms } from 'slate'

import type { Heading } from '../types'
import { selectionHasElement, trimSelection } from './selection'

export function isBoldActive(editor: SlateEditor) {
  return SlateEditor.marks(editor)?.strong === true
}

export function toggleBoldMark(editor: SlateEditor) {
  trimSelection(editor)
  if (isBoldActive(editor)) {
    SlateEditor.removeMark(editor, 'strong')
  } else {
    SlateEditor.addMark(editor, 'strong', true)
  }
}

export function isItalicActive(editor: SlateEditor) {
  return SlateEditor.marks(editor)?.em === true
}

export function toggleItalicMark(editor: SlateEditor) {
  trimSelection(editor)
  if (isItalicActive(editor)) {
    SlateEditor.removeMark(editor, 'em')
  } else {
    SlateEditor.addMark(editor, 'em', true)
  }
}

export function isCodeActive(editor: SlateEditor) {
  return SlateEditor.marks(editor)?.code === true
}

export function toggleCode(editor: SlateEditor) {
  if (isCodeActive(editor)) {
    SlateEditor.removeMark(editor, 'code')
  } else {
    SlateEditor.addMark(editor, 'code', true)
  }
}

export function isAnyHeadingActive(editor: SlateEditor) {
  return selectionHasElement((e) => e.type === 'h', editor)
}

export const isHeadingActive =
  (heading: Heading['level']) => (editor: SlateEditor) => {
    return selectionHasElement(
      (e) => e.type === 'h' && e.level === heading,
      editor
    )
  }

export const toggleHeading =
  (heading: Heading['level']) => (editor: SlateEditor) => {
    if (isHeadingActive(heading)(editor)) {
      Transforms.setNodes(editor, {
        type: 'p',
      })
      Transforms.unsetNodes(editor, 'level')
    } else {
      Transforms.setNodes(editor, {
        type: 'h',
        level: heading,
      })
    }
  }
