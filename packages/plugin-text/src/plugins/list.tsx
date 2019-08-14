//@ts-ignore FIXME
import List from '@convertkit/slate-lists'
import { Block, Editor } from 'slate'

import { defaultNode } from '../factory'

export const orderedListNode = 'ordered-list'
export const unorderedListNode = 'unordered-list'
export const listItemNode = 'list-item'
export const listItemChildNode = 'list-item-child'

type ListType = typeof orderedListNode | typeof unorderedListNode

export const isList = (type: ListType) => (editor: Editor) => {
  const { document, startBlock } = editor.value
  if (!startBlock || startBlock.type !== listItemChildNode) return false
  const listItem = document.getParent(startBlock.key) as Block
  const list = document.getParent(listItem.key) as Block
  return list.type === type
}

export const toggleList = (type: ListType = unorderedListNode) => (
  editor: Editor
) => {
  return editor.command('toggleList', { type })
}

/* eslint-disable @typescript-eslint/camelcase */
export const createListPlugin = () => () =>
  List({
    blocks: {
      ordered_list: orderedListNode,
      unordered_list: unorderedListNode,
      list_item: listItemNode,
      list_item_child: listItemChildNode,
      default: defaultNode
    }
  })
/* eslint-enable @typescript-eslint/camelcase */
