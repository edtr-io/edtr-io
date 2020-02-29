import {
  EditorPlugin,
  EditorPluginProps,
  serializedScalar,
  SerializedScalarStateType
} from '@edtr-io/plugin'
import { DeepPartial } from '@edtr-io/ui'
import * as R from 'ramda'
import * as React from 'react'
import { BlockJSON, InlineJSON, MarkJSON, Value, ValueJSON } from 'slate'
import { Rule } from 'slate-html-serializer'
import {
  Editor,
  EditorProps,
  Plugin,
  RenderBlockProps,
  RenderInlineProps,
  RenderMarkProps
} from 'slate-react'

import { Controls, createUiPlugin } from './controls'
import { isValueEmpty } from './factory'
import { TextEditor } from './factory/editor'
import { SlatePluginClosure } from './factory/types'
import { emptyDocument } from './model'
import { createPlugins } from './plugins'
import { NewNode, serializer } from './state-migration-serializer'

/** @public */
export type MarkEditorProps = RenderMarkProps

/** @public */
export interface MarkRendererProps {
  mark: MarkJSON
}

/** @public */
export type BlockEditorProps = RenderBlockProps
/** @public */
export type InlineEditorProps = RenderInlineProps
/** @public */
export type NodeEditorProps = BlockEditorProps | InlineEditorProps
/** @public */
export type NodeControlsProps = EditorProps & {
  editor: Editor
}
/** @public */
export interface InlineRendererProps {
  node: InlineJSON
}
/** @public */
export interface BlockRendererProps {
  node: BlockJSON
}
/** @public */
export type NodeRendererProps = BlockRendererProps | InlineRendererProps

/** @public */
export type TextPlugin = Plugin &
  Rule & {
    // FIXME: This type should exist in slate somewhere...
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    commands?: { [key: string]: (editor: Editor, ...args: any[]) => Editor }
  }

/**
 * @param config - {@link TextConfig | Plugin configuration}
 * @public
 */
export function createTextPlugin(
  config: TextConfig
): EditorPlugin<TextPluginState, TextPluginConfig> {
  const {
    placeholder = 'Write something or add elements with \u2295.',
    registry,
    i18n = {},
    theme = {},
    blockquote
  } = config

  return {
    Component: TextEditor,
    config: ({ editor }) => {
      const blue = '#1794c1',
        green = '#469a40',
        orange = '#ff6703'
      return {
        registry,
        plugins: [
          ...createPlugins(config.plugins),
          createUiPlugin({ Component: Controls, plugins: config.plugins })
        ],
        placeholder,
        i18n: R.mergeDeepRight(
          {
            blockquote: {
              toggleTitle: 'Quote'
            },
            colors: {
              setColorTitle: 'Set color',
              resetColorTitle: 'Reset color',
              openMenuTitle: 'Colors',
              closeMenuTitle: 'Close sub menu'
            },
            headings: {
              setHeadingTitle(level: number) {
                return `Heading ${level}`
              },
              openMenuTitle: 'Headings',
              closeMenuTitle: 'Close sub menu'
            },
            link: {
              toggleTitle: 'Link (Strg + K)',
              placeholder: 'Enter URL',
              openInNewTabTitle: 'Open in new tab'
            },
            list: {
              toggleOrderedList: 'Ordered list',
              toggleUnorderedList: 'Unordered list',
              openMenuTitle: 'Lists',
              closeMenuTitle: 'Close sub menu'
            },
            math: {
              toggleTitle: 'Math formula (Strg + M)',
              displayBlockLabel: 'Display as block',
              placeholder: '[formula]',
              editors: {
                visual: 'visual',
                latex: 'LaTeX',
                noVisualEditorAvailableMessage: 'Only LaTeX editor available'
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
                      π, α, β, γ: <KeySpan>pi</KeySpan>,{' '}
                      <KeySpan>alpha</KeySpan>, <KeySpan>beta</KeySpan>,
                      <KeySpan>gamma</KeySpan>
                    </p>
                    <p>
                      ≤, ≥: <KeySpan>{'<='}</KeySpan>, <KeySpan>{'>='}</KeySpan>
                    </p>
                    <p>
                      Root: <KeySpan>\sqrt</KeySpan>,{' '}
                      <KeySpan>\nthroot</KeySpan>
                    </p>
                    <p>
                      Math symbols: <KeySpan>{'\\<NAME>'}</KeySpan>, e.g.{' '}
                      <KeySpan>\neq</KeySpan> (≠), <KeySpan>\pm</KeySpan> (±),
                      ...
                    </p>
                    <p>
                      Functions: <KeySpan>sin</KeySpan>, <KeySpan>cos</KeySpan>,{' '}
                      <KeySpan>ln</KeySpan>, ...
                    </p>
                  </>
                )
              }
            },
            richText: {
              toggleStrongTitle: 'Bold (Strg + B)',
              toggleEmphasizeTitle: 'Italic (Strg + I)'
            },
            suggestions: {
              noResultsMessage: 'No items found'
            }
          },
          i18n
        ),
        theme: R.mergeDeepRight(
          {
            backgroundColor: 'transparent',
            color: editor.color,
            hoverColor: editor.primary.background,
            active: {
              backgroundColor: '#b6b6b6',
              color: editor.backgroundColor
            },
            dropDown: {
              backgroundColor: editor.backgroundColor
            },
            suggestions: {
              background: {
                default: 'transparent',
                highlight: editor.primary.background
              },
              text: {
                default: editor.color,
                highlight: editor.danger.background
              }
            },
            plugins: {
              colors: {
                colors: [blue, green, orange],
                defaultColor: 'black'
              }
            }
          },
          theme
        ),
        blockquote
      }
    },
    state: serializedScalar(emptyDocument, serializer),
    onKeyDown() {
      return false
    },
    isEmpty: state => {
      return isValueEmpty(Value.fromJSON(state.value))
    }
  }
}

/** @public */
export interface TextConfig {
  placeholder?: TextPluginConfig['placeholder']
  plugins?: {
    suggestions?: boolean
    math?: boolean
    headings?: boolean
    lists?: boolean
    colors?: boolean
  }
  registry: TextPluginConfig['registry']
  i18n?: DeepPartial<TextPluginConfig['i18n']>
  theme?: DeepPartial<TextPluginConfig['theme']>
  blockquote?: string
}

/** @public */
export type TextPluginState = SerializedScalarStateType<NewNode[], ValueJSON>

/** @public */
export interface TextPluginConfig {
  placeholder: string
  plugins: ((pluginClosure: SlatePluginClosure) => TextPlugin)[]
  registry: {
    name: string
    title?: string
    description?: string
  }[]
  i18n: {
    blockquote: {
      toggleTitle: string
    }
    colors: {
      setColorTitle: string
      resetColorTitle: string
      openMenuTitle: string
      closeMenuTitle: string
    }
    headings: {
      setHeadingTitle(level: number): string
      openMenuTitle: string
      closeMenuTitle: string
    }
    link: {
      toggleTitle: string
      placeholder: string
      openInNewTabTitle: string
    }
    list: {
      toggleOrderedList: string
      toggleUnorderedList: string
      openMenuTitle: string
      closeMenuTitle: string
    }
    math: {
      toggleTitle: string
      displayBlockLabel: string
      placeholder: string
      editors: {
        visual: string
        latex: string
        noVisualEditorAvailableMessage: string
      }
      helpText(
        KeySpan: React.ComponentType<{ children: React.ReactNode }>
      ): React.ReactNode
    }
    richText: {
      toggleStrongTitle: string
      toggleEmphasizeTitle: string
    }
    suggestions: {
      noResultsMessage: string
    }
  }
  theme: {
    backgroundColor: string
    color: string
    hoverColor: string
    active: {
      backgroundColor: string
      color: string
    }
    dropDown: {
      backgroundColor: string
    }
    suggestions: {
      background: {
        default: string
        highlight: string
      }
      text: {
        default: string
        highlight: string
      }
    }
    plugins: {
      colors: {
        colors: string[]
        defaultColor: string
      }
    }
  }
  blockquote?: string
}

/** @public */
export type TextProps = EditorPluginProps<TextPluginState, TextPluginConfig>

export { isValueEmpty, SlatePluginClosure }
export { SlateClosure } from './factory/types'
export * from './state-migration-serializer'

export { slateValueToHtml, htmlToSlateValue } from './model'
