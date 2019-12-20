import { autoLink } from './auto-link'
import { createColorPlugin } from './colors'
import { createHeadingsPlugin } from './headings'
import { createKatexPlugin } from './katex'
import { createLinkPlugin } from './link'
import { createListPlugin } from './list'
import { markdownShortcuts } from './markdown'
import { createParagraphPlugin } from './paragraph'
import { pluginSuggestions } from './plugin-suggestions'
import { createRichTextPlugin } from './rich-text'
import { TextConfig } from '..'

export const plugins: TextConfig['plugins'] = [
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
