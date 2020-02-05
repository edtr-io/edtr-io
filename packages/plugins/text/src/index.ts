import {
  EditorPlugin,
  EditorPluginProps,
  serializedScalar
} from '@edtr-io/plugin'
import { DeepPartial } from '@edtr-io/ui'
import * as R from 'ramda'
import { BlockJSON, InlineJSON, MarkJSON, Value } from 'slate'
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
import { plugins } from './plugins'
import { serializer } from './state-migration-serializer'

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

/** @public */
export const textState = serializedScalar(emptyDocument, serializer)
/** @public */
export type TextState = typeof textState
/** @public */
export interface TextConfig {
  placeholder: string
  plugins: ((pluginClosure: SlatePluginClosure) => TextPlugin)[]
  registry: {
    name: string
    title?: string
    description?: string
  }[]
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
export type TextProps = EditorPluginProps<TextState, TextConfig>

/** @public */
export function createTextPlugin({
  placeholder = 'Schreibe etwas oder füge mit \u2295 Elemente hinzu.',
  registry,
  theme = {},
  blockquote
}: {
  placeholder?: TextConfig['placeholder']
  registry: TextConfig['registry']
  theme?: DeepPartial<TextConfig['theme']>
  blockquote?: string
}): EditorPlugin<TextState, TextConfig> {
  return {
    Component: TextEditor,
    config: ({ editor }) => {
      const blue = '#1794c1',
        green = '#469a40',
        orange = '#ff6703'
      return {
        registry,
        plugins: [...plugins, createUiPlugin({ Component: Controls })],
        placeholder,
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
    state: textState,
    onKeyDown() {
      return false
    },
    isEmpty: state => {
      return isValueEmpty(Value.fromJSON(state.value))
    }
  }
}

export { isValueEmpty, SlatePluginClosure }
export { SlateClosure } from './factory/types'
export * from './state-migration-serializer'
