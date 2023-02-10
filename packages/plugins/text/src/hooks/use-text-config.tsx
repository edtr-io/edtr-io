import { RegistryContext } from '@edtr-io/plugin-rows/internal'
import { merge, useTheme } from '@edtr-io/ui'
import * as React from 'react'

import type { TextConfig, TextPluginConfig } from '../types'

const defaultEnabledPlugins = {
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

export function useTextConfig(config: TextConfig): TextPluginConfig {
  const {
    placeholder = 'Write something or add elements with \u2295.',
    i18n = {},
    theme = {},
    blockquote,
    noLinebreaks,
  } = config
  const { editor } = useTheme()
  const registry = React.useContext(RegistryContext) ?? config.registry

  const blue = '#1794c1',
    green = '#469a40',
    orange = '#ff6703'

  const enabledPlugins = config.plugins || defaultEnabledPlugins

  return {
    registry,
    enabledPlugins,
    placeholder,
    i18n: merge({
      fallback: {
        blockquote: {
          toggleTitle: 'Quote',
        },
        code: {
          toggleTitle: 'Code',
        },
        colors: {
          setColorTitle: 'Set color',
          resetColorTitle: 'Reset color',
          openMenuTitle: 'Colors',
          closeMenuTitle: 'Close sub menu',
        },
        headings: {
          setHeadingTitle(level: number) {
            return `Heading ${level}`
          },
          openMenuTitle: 'Headings',
          closeMenuTitle: 'Close sub menu',
        },
        link: {
          toggleTitle: 'Link (Strg + K)',
          placeholder: 'Enter URL',
          openInNewTabTitle: 'Open in new tab',
        },
        list: {
          toggleOrderedList: 'Ordered list',
          toggleUnorderedList: 'Unordered list',
          openMenuTitle: 'Lists',
          closeMenuTitle: 'Close sub menu',
        },
        math: {
          toggleTitle: 'Math formula (Strg + M)',
          displayBlockLabel: 'Display as block',
          placeholder: '[formula]',
          editors: {
            visual: 'visual',
            latex: 'LaTeX',
            noVisualEditorAvailableMessage: 'Only LaTeX editor available',
          },
          helpText(
            KeySpan: React.ComponentType<{ children: React.ReactNode }>
          ) {
            return (
              <>
                Shortcuts:
                <br />
                <br />
                <p>
                  Fraction: <KeySpan>/</KeySpan>
                </p>
                <p>
                  Superscript: <KeySpan>↑</KeySpan> or <KeySpan>^</KeySpan>
                </p>
                <p>
                  Subscript: <KeySpan>↓</KeySpan> oder <KeySpan>_</KeySpan>
                </p>
                <p>
                  π, α, β, γ: <KeySpan>pi</KeySpan>, <KeySpan>alpha</KeySpan>,{' '}
                  <KeySpan>beta</KeySpan>,<KeySpan>gamma</KeySpan>
                </p>
                <p>
                  ≤, ≥: <KeySpan>{'<='}</KeySpan>, <KeySpan>{'>='}</KeySpan>
                </p>
                <p>
                  Root: <KeySpan>\sqrt</KeySpan>, <KeySpan>\nthroot</KeySpan>
                </p>
                <p>
                  Math symbols: <KeySpan>{'\\<NAME>'}</KeySpan>, e.g.{' '}
                  <KeySpan>\neq</KeySpan> (≠), <KeySpan>\pm</KeySpan> (±), ...
                </p>
                <p>
                  Functions: <KeySpan>sin</KeySpan>, <KeySpan>cos</KeySpan>,{' '}
                  <KeySpan>ln</KeySpan>, ...
                </p>
              </>
            )
          },
        },
        richText: {
          toggleStrongTitle: 'Bold (Strg + B)',
          toggleEmphasizeTitle: 'Italic (Strg + I)',
        },
        suggestions: {
          noResultsMessage: 'No items found',
        },
      },
      values: i18n,
    }),
    theme: merge({
      fallback: {
        backgroundColor: 'transparent',
        color: editor.color,
        hoverColor: editor.primary.background,
        active: {
          backgroundColor: '#b6b6b6',
          color: editor.backgroundColor,
        },
        dropDown: {
          backgroundColor: editor.backgroundColor,
        },
        suggestions: {
          background: {
            default: 'transparent',
            highlight: editor.primary.background,
          },
          text: {
            default: editor.color,
            highlight: editor.danger.background,
          },
        },
        plugins: {
          colors: {
            colors: [blue, green, orange],
            defaultColor: 'black',
          },
        },
      },
      values: theme,
    }),
    blockquote,
    noLinebreaks,
  }
}
