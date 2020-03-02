import { TextConfig, TextPluginConfig } from '..'
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

export function createPlugins(
  plugins: TextConfig['plugins'] = {
    suggestions: true,
    math: true,
    headings: true,
    lists: true,
    colors: true
  }
): TextPluginConfig['plugins'] {
  return [
    ...(plugins.suggestions ? [pluginSuggestions] : []),
    createParagraphPlugin(),
    createRichTextPlugin(),
    createLinkPlugin(),
    createKatexPlugin(),
    ...(plugins.headings ? [createHeadingsPlugin()] : []),
    ...(plugins.lists ? [createListPlugin()] : []),
    ...(plugins.colors ? [createColorPlugin()] : []),
    markdownShortcuts,
    autoLink
  ]
}
