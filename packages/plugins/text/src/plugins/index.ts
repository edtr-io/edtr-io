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
    links: true,
    lists: true,
    math: true,
    paragraphs: true,
    richText: true,
    suggestions: true,
  }
): TextPluginConfig['plugins'] {
  return [
    ...(plugins.code ? [createCodePlugin()] : []),
    ...(plugins.colors ? [createColorPlugin()] : []),
    ...(plugins.headings ? [createHeadingsPlugin()] : []),
    ...(plugins.math ? [createKatexPlugin()] : []),
    ...(plugins.links ? [createLinkPlugin()] : []),
    ...(plugins.lists ? [createListPlugin()] : []),
    ...(plugins.paragraphs ? [createParagraphPlugin()] : []),
    ...(plugins.richText ? [createRichTextPlugin()] : []),
    ...(plugins.suggestions ? [pluginSuggestions] : []),
    markdownShortcuts,
    autoLink,
  ]
}
