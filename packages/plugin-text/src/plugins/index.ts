import { createRichTextPlugin } from './rich-text'
import { createParagraphPlugin } from './paragraph'
import { createLinkPlugin } from './link'
import { TextPluginOptions } from '../factory/types'

export const plugins: TextPluginOptions['plugins'] = [
  createParagraphPlugin(),
  createRichTextPlugin(),
  createLinkPlugin()
]
