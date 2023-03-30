import { ListsEditor } from '@prezly/slate-lists'
import { BaseEditor } from 'slate'
import { ReactEditor } from 'slate-react'

/** @public */
export type CustomElement =
  | Paragraph
  | OrderedList
  | UnorderedList
  | ListItem
  | ListItemText
  | Heading
  | Link
  | MathElement

/** @public */
export interface Heading {
  type: 'h'
  level: 1 | 2 | 3
  children: CustomText[]
}

/** @public */
export interface Paragraph {
  type: 'p'
  children: CustomText[]
}

/** @public */
export interface Link {
  type: 'a'
  href: string
  children: CustomText[]
}

/** @public */
export interface UnorderedList {
  type: 'unordered-list'
  children: ListItem[]
}

/** @public */
export interface OrderedList {
  type: 'ordered-list'
  children: ListItem[]
}

/** @public */
export interface ListItem {
  type: 'list-item'
  children: ListItemText[]
}

/** @public */
export interface ListItemText {
  type: 'list-item-child'
  children: CustomText[]
}

/** @public */
export interface MathElement {
  type: 'math'
  src: string
  inline: boolean
  children: CustomText[]
}

/** @public */
export interface CustomText {
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
