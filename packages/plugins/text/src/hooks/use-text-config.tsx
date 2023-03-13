import { merge, useTheme } from '@edtr-io/ui'
import * as React from 'react'

import { TextEditorControl } from '../types'
import type {
  Heading,
  TextEditorConfig,
  TextEditorPluginConfig,
} from '../types'

const defaultEnabledControls: TextEditorControl[] = [
  TextEditorControl.code,
  TextEditorControl.colors,
  TextEditorControl.headings,
  TextEditorControl.links,
  TextEditorControl.lists,
  TextEditorControl.math,
  TextEditorControl.richText,
]

const colors = [
  {
    value: '#1794c1',
    name: 'Blue',
  },
  {
    value: '#469a40',
    name: 'Green',
  },
  {
    value: '#ff6703',
    name: 'Orange',
  },
]

export function useTextConfig(
  config: TextEditorConfig
): TextEditorPluginConfig {
  const {
    placeholder = 'Write something or add elements with \u2295.',
    i18n = {},
    theme = {},
    blockquote,
    noLinebreaks,
  } = config
  const { editor } = useTheme()

  return {
    controls: config.controls || defaultEnabledControls,
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
          colorNames: colors.map((color) => color.name),
        },
        headings: {
          setHeadingTitle(level: Heading['level']) {
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
        borderColor: editor.backgroundColor,
        borderRadius: '4px',
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
        overlay: {
          backgroundColor: editor.backgroundColor,
          boxShadow: '0 2px 4px 0 rgba(0,0,0,0.50)',
          color: editor.color,
        },
        controls: {
          colors: {
            colors: colors.map((color) => color.value),
            defaultColor: 'black',
          },
          headings: [1, 2, 3],
        },
      },
      values: theme,
    }),
    blockquote,
    noLinebreaks,
  }
}
