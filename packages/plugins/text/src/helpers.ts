import { Range } from 'slate'
import { useSlate } from 'slate-react'

import { Editor } from './types'

export function isCollapsed(editor: Editor) {
  return editor.selection && Range.isCollapsed(editor.selection)
}

export function useEditor(): Editor {
  return useSlate() as Editor
}
