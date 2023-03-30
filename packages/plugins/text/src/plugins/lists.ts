import {
  ListType,
  withLists as withListsPlugin,
  withListsReact,
} from '@prezly/slate-lists'
import { Editor as SlateEditor, Element, Node } from 'slate'

import type {
  ListItem,
  ListItemText,
  OrderedList,
  Paragraph,
  UnorderedList,
} from '../types'

// TODO: Use enum for types here as in https://www.npmjs.com/package/@prezly/slate-lists
// TODO: Fix "as ..." parts in the functions
export const withLists = (editor: SlateEditor) => {
  const editorWithListsPlugin = withListsPlugin({
    isConvertibleToListTextNode(node: Node) {
      return Element.isElementType(node, 'p')
    },
    isDefaultTextNode(node: Node) {
      return Element.isElementType(node, 'p')
    },
    isListNode(node: Node, type?: ListType) {
      if (type) {
        return Element.isElementType(node, type)
      }
      return (
        Element.isElementType(node, 'ordered-list') ||
        Element.isElementType(node, 'unordered-list')
      )
    },
    isListItemNode(node: Node) {
      return Element.isElementType(node, 'list-item')
    },
    isListItemTextNode(node: Node) {
      return Element.isElementType(node, 'list-item-child')
    },
    createDefaultTextNode(props = {}) {
      return { children: [{ text: '' }], ...props, type: 'p' } as Paragraph
    },
    createListNode(type: ListType = ListType.UNORDERED, props = {}) {
      const nodeType =
        type === ListType.ORDERED ? 'ordered-list' : 'unordered-list'
      return { children: [{ text: '' }], ...props, type: nodeType } as
        | OrderedList
        | UnorderedList
    },
    createListItemNode(props = {}) {
      return {
        children: [{ text: '' }],
        ...props,
        type: 'list-item',
      } as ListItem
    },
    createListItemTextNode(props = {}) {
      return {
        children: [{ text: '' }],
        ...props,
        type: 'list-item-child',
      } as ListItemText
    },
  })

  return withListsReact(editorWithListsPlugin(editor))
}
