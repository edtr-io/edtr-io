import { ListsEditor, ListType } from '@prezly/slate-lists'
import { Editor as SlateEditor } from 'slate'

import { selectionHasElement } from './selection'

export function isOrderedListActive(editor: SlateEditor) {
  return selectionHasElement((e) => e.type === 'ordered-list', editor)
}

export function isUnorderedListActive(editor: SlateEditor) {
  return selectionHasElement((e) => e.type === 'unordered-list', editor)
}

export function toggleOrderedList(editor: SlateEditor) {
  if (isUnorderedListActive(editor)) {
    ListsEditor.unwrapList(editor)
    ListsEditor.wrapInList(editor, ListType.ORDERED)
  } else if (isOrderedListActive(editor)) {
    ListsEditor.unwrapList(editor)
  } else {
    ListsEditor.wrapInList(editor, ListType.ORDERED)
  }
}

export function toggleUnorderedList(editor: SlateEditor) {
  if (isOrderedListActive(editor)) {
    ListsEditor.unwrapList(editor)
    ListsEditor.wrapInList(editor, ListType.UNORDERED)
  } else if (isUnorderedListActive(editor)) {
    ListsEditor.unwrapList(editor)
  } else {
    ListsEditor.wrapInList(editor, ListType.UNORDERED)
  }
}
