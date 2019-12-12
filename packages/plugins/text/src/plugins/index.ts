import { TextPluginOptions } from '../factory/types'
import { createColorPlugin } from './colors'
import { createHeadingsPlugin } from './headings'
import { createKatexPlugin } from './katex'
import { createLinkPlugin } from './link'
import { createListPlugin } from './list'
import { markdownShortcuts } from './markdown'
import { createParagraphPlugin } from './paragraph'
import { pluginSuggestions } from './plugin-suggestions'
import { createRichTextPlugin } from './rich-text'
import { autoLink } from './auto-link'

export const plugins: TextPluginOptions['plugins'] = [
  pluginSuggestions,
  createParagraphPlugin(),
  createRichTextPlugin(),
  createLinkPlugin(),
  createKatexPlugin(),
  createHeadingsPlugin(),
  createListPlugin(),
  createColorPlugin(),
  markdownShortcuts,
  autoLink
]
