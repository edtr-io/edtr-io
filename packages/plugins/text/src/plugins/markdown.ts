import { Editor } from 'slate'

import { SlatePluginClosure } from '../factory/types'
import { createBlockquote } from './blockquote'
import { createSetHeading } from './headings'
import { toggleList, unorderedListNode, isList, orderedListNode } from './list'
import { TextPlugin } from '..'

const handleMarkdown = (
  chars: string,
  editor: Editor,
  next: Function,
  name: string
) => {
  if (/^\d+\.$/.test(chars)) {
    if (isList(orderedListNode)(editor)) {
      return undefined
    }
    return toggleList(orderedListNode)(editor)
  }
  switch (chars) {
    case '*':
    case '-':
    case '+':
      if (isList(unorderedListNode)(editor)) {
        return undefined
      }
      return toggleList(unorderedListNode)(editor)
    case '>':
      return createBlockquote(editor, name)
    case '#':
      return createSetHeading(1)(editor)
    case '##':
      return createSetHeading(2)(editor)
    case '###':
      return createSetHeading(3)(editor)
    case '####':
      return createSetHeading(4)(editor)
    case '#####':
      return createSetHeading(5)(editor)
    case '######':
      return createSetHeading(6)(editor)
    default:
      return undefined
  }
}

const onSpace = (
  event: KeyboardEvent,
  editor: Editor,
  next: Function,
  name: string
) => {
  const { value } = editor
  const { selection } = value
  if (selection.isExpanded) return next()

  const { startBlock } = value
  const { start } = selection
  const chars = startBlock.text.slice(0, start.offset).replace(/\s*/g, '')
  const handled = handleMarkdown(chars, editor, next, name)
  if (!handled) {
    return next()
  }

  event.preventDefault()

  editor.moveFocusToStartOfNode(startBlock).delete()
}

export const markdownShortcuts = (
  pluginClosure: SlatePluginClosure
): TextPlugin => {
  return {
    onKeyDown(event, editor, next) {
      if (!pluginClosure.current) {
        return next()
      }
      const e = (event as unknown) as KeyboardEvent
      const name = pluginClosure.current.name
      switch (e.key) {
        case ' ':
          return onSpace(e, editor, next, name)
        default:
          return next()
      }
    }
  }
}
