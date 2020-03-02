import { Editor } from 'slate-react'

import { TextPlugin } from '..'
import { SlatePluginClosure } from '../factory/types'
import { linkNode } from '../model'

const onSpecialKey = (event: KeyboardEvent, editor: Editor, next: Function) => {
  const { value } = editor
  const { selection } = value
  if (selection.isExpanded) return next()

  const { focusText } = value
  const { start } = selection

  const slice = focusText.text.slice(0, start.offset)
  const matches = /((http:\/\/|https:\/\/)?[_\-a-z0-9.]+\.(com|de|org)(:[0-9])?[/\w?%-_]*)$/g.exec(
    slice
  )
  if (matches && matches.length !== 0) {
    const positionOfURL = slice.length - matches[0].length
    if (
      slice.length !== matches[0].length &&
      slice.slice(positionOfURL - 1, positionOfURL) !== ' '
    )
      return next()
    let href = matches[0]
    if (!matches[1].includes('http')) href = `https://${href}`
    editor
      .moveFocusBackward(matches[0].length)
      .wrapInline({
        type: linkNode,
        data: {
          href
        }
      })
      .moveToEnd()
      .focus()
  }

  next()
}

export const autoLink = (pluginClosure: SlatePluginClosure): TextPlugin => {
  return {
    onKeyDown(event, editor, next) {
      if (!pluginClosure.current) {
        return next()
      }
      const e = (event as unknown) as KeyboardEvent
      switch (e.key) {
        case ']':
        case ')':
        case ' ':
        case 'Enter':
          return onSpecialKey(e, editor, next)
        default:
          return next()
      }
    }
  }
}
