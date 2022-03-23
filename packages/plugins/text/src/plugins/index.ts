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
    code: true,
    colors: true,
    headings: true,
    link: true,
    lists: true,
    math: true,
    paragraph: true,
    richtext: true,
    suggestions: true,
  }
): TextPluginConfig['plugins'] {
  return [
    ...(plugins.code ? [createCodePlugin()] : []),
    ...(plugins.colors ? [createColorPlugin()] : []),
    ...(plugins.headings ? [createHeadingsPlugin()] : []),
    ...(plugins.math ? [createKatexPlugin()] : []),
    ...(plugins.link ? [createLinkPlugin()] : []),
    ...(plugins.lists ? [createListPlugin()] : []),
    ...(plugins.paragraph ? [createParagraphPlugin()] : []),
    ...(plugins.richtext ? [createRichTextPlugin()] : []),
    ...(plugins.suggestions ? [pluginSuggestions] : []),
    markdownShortcuts,
    autoLink,
  ]
}
