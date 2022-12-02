import { ListsEditor, ListType } from '@prezly/slate-lists'
import { Transforms, CustomTypes, Editor as SlateEditor, Node } from 'slate'

const handleMarkdown = (chars: string, editor: CustomTypes['Editor']) => {
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
    default:
      return undefined
  }
}

function createUnorderedList(editor: CustomTypes['Editor']) {
  ListsEditor.wrapInList(editor, ListType.UNORDERED)
  return true
}

function createHeading(level: 1 | 2 | 3, editor: CustomTypes['Editor']) {
  Transforms.setNodes(editor, {
    type: 'h',
    level: level,
  })
  return true
}

const onSpace = (event: KeyboardEvent, editor: CustomTypes['Editor']) => {
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
    onKeyDown(event: KeyboardEvent, editor: CustomTypes['Editor']) {
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
