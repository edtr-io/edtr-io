import List from '@convertkit/slate-lists'
import { Block, Editor as CoreEditor } from 'slate'
import { Editor } from 'slate-react'

import {
  defaultNode,
  orderedListNode,
  unorderedListNode,
  listItemNode,
  listItemChildNode
} from '../model'

type ListType = typeof orderedListNode | typeof unorderedListNode

export const isList = (type: ListType) => (editor: Editor | CoreEditor) => {
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
