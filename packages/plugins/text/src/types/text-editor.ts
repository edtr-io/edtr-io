import { ListsEditor } from '@prezly/slate-lists'
import { BaseEditor } from 'slate'
import { ReactEditor } from 'slate-react'

type CustomElement =
  | Paragraph
  | OrderedList
  | UnorderedList
  | ListItem
  | ListItemText
  | Heading
  | Link
  | MathElement

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
  type: 'list-item-text'
  children: CustomText[]
}

export interface MathElement {
  type: 'math'
  src: string
  inline: boolean
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
