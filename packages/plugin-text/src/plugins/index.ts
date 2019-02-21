import { createRichTextPlugin } from './rich-text'
import { createParagraphPlugin } from './paragraph'
import { createLinkPlugin } from './link'

export const plugins = [
  createParagraphPlugin(),
  createRichTextPlugin(),
  createLinkPlugin()
]
