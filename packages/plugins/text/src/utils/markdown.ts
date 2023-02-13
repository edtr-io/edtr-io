import { ListsEditor, ListType } from '@prezly/slate-lists'
import { Transforms, Editor as SlateEditor, Node } from 'slate'

import { Heading } from '../types'

const handleMarkdown = (chars: string, editor: SlateEditor) => {
  switch (chars) {
    case '*':
    case '-':
    case '+':
      return createUnorderedList(editor)
    case '#':
      return createHeading(1, editor)
    case '##':
      return createHeading(2, editor)
    case '###':
      return createHeading(3, editor)
    case '####':
      return createHeading(4, editor)
    case '#####':
      return createHeading(5, editor)
    case '######':
      return createHeading(6, editor)
    default:
      return undefined
  }
}

function createUnorderedList(editor: SlateEditor) {
  ListsEditor.wrapInList(editor, ListType.UNORDERED)
  return true
}

function createHeading(level: Heading['level'], editor: SlateEditor) {
  Transforms.setNodes(editor, { type: 'h', level })
  return true
}

const onSpace = (event: KeyboardEvent, editor: SlateEditor) => {
  const { selection } = editor

  if (selection) {
    const nodes = Array.from(SlateEditor.nodes(editor, { at: selection }))
    if (nodes.length >= 2) {
      const startBlock = nodes[2][0]
      const text = Node.string(startBlock)
      const chars = text.slice(0, selection?.focus.offset).replace(/\s*/g, '')
      const handled = handleMarkdown(chars, editor)
      if (handled) {
        event.preventDefault()

        editor.deleteBackward('word')
      }
    }
  }
}

export const markdownShortcuts = () => {
  return {
    onKeyDown(event: KeyboardEvent, editor: SlateEditor) {
      const e = event as unknown as KeyboardEvent
      switch (e.key) {
        case ' ':
          return onSpace(e, editor)
        default:
          return
      }
    },
  }
}
