import { createRichTextPlugin } from './rich-text'
import { createParagraphPlugin } from './paragraph'
import { createLinkPlugin } from './link'
import { TextPluginOptions } from '../factory/types'
import { createKatexPlugin } from './katex'
import { createHeadingsPlugin } from './headings'
import { createListPlugin } from './list'
import { createColorPlugin } from './colors'
import { markdownShortcuts } from './markdown'
import { pluginSuggestions } from './plugin-suggestions'

export const plugins: TextPluginOptions['plugins'] = [
  createParagraphPlugin(),
  createRichTextPlugin(),
  createLinkPlugin(),
  createKatexPlugin(),
  createHeadingsPlugin(),
  createListPlugin(),
  createColorPlugin(),
  markdownShortcuts,
  pluginSuggestions
]
