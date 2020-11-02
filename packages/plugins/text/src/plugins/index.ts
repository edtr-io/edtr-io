import { TextConfig, TextPluginConfig } from '..'
import { autoLink } from './auto-link'
import { createCodePlugin } from './code'
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
    code: true,
    math: true,
    headings: true,
    lists: true,
    colors: true,
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
    ...(plugins.code ? [createCodePlugin()] : []),
    markdownShortcuts,
    autoLink,
  ]
}
