import { Editor } from 'slate'
import { Text, createEditor } from 'slate'
import { SlatePluginClosure } from '../factory/types'
import { linkNode, unorderedListNode, orderedListNode } from '../model'
import { createBlockquote } from './blockquote'
import { createSetHeading } from './headings'
import { toggleList, isList } from './list'
import { TextPlugin } from '..'
import { match } from 'minimatch'


const onSpace = (
  event: KeyboardEvent,
  editor: Editor,
  next: Function,
  name: string
) => {
  
  const { value } = editor
  const { selection } = value
  if (selection.isExpanded) return next()

  const { focusBlock } = value
  const { start } = selection

  const chars = focusBlock.text.slice(0, start.offset)
  console.log(chars)


  const matches = /((http:\/\/|https:\/\/)?[_\-a-zA-Z0-9.]+\.(com|de))$/.exec(chars)
  if (matches && matches.length !== 0){
    console.log('match url')
    for(const [node, path] of focusBlock.texts()){
      
      if(Text.isText(node)){
        console.log('text', Text.isText(node))
        const { key, text } = node
        const parts = text.split(matches[1])
        let offset = 0
        console.log(text)
        console.log(parts)

        parts.forEach(( part, i ) => {
          if(i !== 0 ){
            const select = editor.select({
              anchor: { path, key, offset: offset - matches[1].length },
              focus: { path, key, offset }
            })
            
            select.wrapInline({
              type: linkNode,
              data: {
                href: matches[1]
              }
            }).moveToEnd()
            .focus()
          }
          offset = offset + part.length + matches[1].length
        })
      }
    }
  }

  next()
}

export const autoLink = (
  pluginClosure: SlatePluginClosure
): TextPlugin => {
  return {
    decorateNode(node, editor, next){
      //console.log('decoration')
      //console.log(node)

      console.log('decoration', node.text)


    },
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
