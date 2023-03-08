import { ListsEditor } from '@prezly/slate-lists'
import { BaseEditor } from 'slate'
import { ReactEditor } from 'slate-react'

import { MathElement as MathElementType } from '.'

type CustomElement =
  | Paragraph
  | OrderedList
  | UnorderedList
  | ListItem
  | ListItemText
  | Heading
  | Link
  | MathElementType

export interface Heading {
  type: 'h'
  level: 1 | 2 | 3
  children: CustomText[]
}

export interface Paragraph {
  type: 'p'
  children: CustomText[]
}

export interface Link {
  type: 'a'
  href: string
  children: CustomText[]
}

export interface UnorderedList {
  type: 'unordered-list'
  children: ListItem[]
}

export interface OrderedList {
  type: 'ordered-list'
  children: ListItem[]
}

export interface ListItem {
  type: 'list-item'
  children: ListItemText[]
}

export interface ListItemText {
  type: 'list-item-child'
  children: CustomText[]
}

interface CustomText {
  text: string
  strong?: true
  em?: true
  code?: true
  color?: number
}

declare module 'slate' {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor & ListsEditor
    Element: CustomElement
    Text: CustomText
  }
}
