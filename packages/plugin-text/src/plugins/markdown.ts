import { toggleList, unorderedListNode, isList, orderedListNode } from './list'
import { Editor } from 'slate'
import { SlatePluginClosure } from '../factory/types'
import { createBlockquote } from './blockquote'
import { createSetHeading } from './headings'
import { setParagraph } from './paragraph'
import { TextPlugin } from '..'

const handleMarkdown = (
  chars: string,
  editor: Editor,
  next: Function,
  name: string
) => {
  if (/\d+\./.test(chars)) {
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

  //if (type === 'list-item' && startBlock.type === 'list-item') return next()
  event.preventDefault()

  editor.moveFocusToStartOfNode(startBlock).delete()
}

const onBackspace = (event: KeyboardEvent, editor: Editor, next: Function) => {
  const { value } = editor
  const { selection } = value
  if (selection.isExpanded) return next()
  if (selection.start.offset !== 0) return next()

  const { startBlock } = value
  if (startBlock.type === 'paragraph') return next()

  event.preventDefault()
  setParagraph(editor)

  // if (startBlock.type === 'list-item') {
  //   editor.unwrapBlock('bulleted-list')
  // }
}

const onEnter = (event: KeyboardEvent, editor: Editor, next: Function) => {
  const { value } = editor
  const { selection } = value
  const { start, end, isExpanded } = selection
  if (isExpanded) return next()

  const { startBlock } = value
  if (start.offset === 0 && startBlock.text.length === 0)
    return onBackspace(event, editor, next)
  if (end.offset !== startBlock.text.length) return next()

  if (
    startBlock.type !== 'heading-one' &&
    startBlock.type !== 'heading-two' &&
    startBlock.type !== 'heading-three' &&
    startBlock.type !== 'heading-four' &&
    startBlock.type !== 'heading-five' &&
    startBlock.type !== 'heading-six' &&
    startBlock.type !== 'block-quote'
  ) {
    return next()
  }

  event.preventDefault()
}

export const markdownPlugin = (
  pluginClosure: SlatePluginClosure
): TextPlugin => {
  //TODO: deserialize
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
        case 'Backspace':
          return onBackspace(e, editor, next)
        case 'Enter':
          return onEnter(e, editor, next)
        default:
          return next()
      }
    }
  }
}
