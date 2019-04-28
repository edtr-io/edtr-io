import { createRichTextPlugin } from './rich-text'
import { createParagraphPlugin } from './paragraph'
import { createLinkPlugin } from './link'
import { TextPluginOptions } from '../factory/types'
import { createKatexPlugin } from './katex'
import { createHeadingsPlugin } from './headings'
import { createListPlugin } from './list'

export const plugins: TextPluginOptions['plugins'] = [
  createParagraphPlugin(),
  createRichTextPlugin(),
  createLinkPlugin(),
  createKatexPlugin(),
  createHeadingsPlugin(),
  createListPlugin()
]
