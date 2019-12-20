import { EditorPlugin, EditorPluginProps, scalar } from '@edtr-io/plugin'
import * as R from 'ramda'
import {
  BlockJSON,
  Editor,
  InlineJSON,
  MarkJSON,
  Value,
  ValueJSON
} from 'slate'
import { Rule } from 'slate-html-serializer' // TODO: Remove this reference
import {
  EditorProps,
  Plugin,
  RenderBlockProps,
  RenderInlineProps,
  RenderMarkProps
} from 'slate-react'

import { createUiPlugin, Controls } from './controls'
import { isValueEmpty } from './factory'
import { TextEditor } from './factory/editor'
import { SlatePluginClosure } from './factory/types'
import { emptyDocument } from './model'
import { plugins } from './plugins'

export type MarkEditorProps = RenderMarkProps

export interface MarkRendererProps {
  mark: MarkJSON
}

export type BlockEditorProps = RenderBlockProps
export type InlineEditorProps = RenderInlineProps
export type NodeEditorProps = BlockEditorProps | InlineEditorProps
export type NodeControlsProps = EditorProps & {
  editor: Editor
}
export interface InlineRendererProps {
  node: InlineJSON
}
export interface BlockRendererProps {
  node: BlockJSON
}
export type NodeRendererProps = BlockRendererProps | InlineRendererProps

export type TextPlugin = Plugin &
  Rule & {
    // FIXME: This type should exist in slate somewhere...
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    commands?: { [key: string]: (editor: Editor, ...args: any[]) => Editor }
  }

export { isValueEmpty } from './factory'

const textState = scalar<ValueJSON>(emptyDocument)
export type TextState = typeof textState
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
}
export type TextProps = EditorPluginProps<TextState, TextConfig>

export function createTextPlugin({
  placeholder = 'Schreibe etwas oder füge mit \u2295 Elemente hinzu.',
  registry,
  theme = {}
}: {
  placeholder?: TextConfig['placeholder']
  registry: TextConfig['registry']
  theme?: DeepPartial<TextConfig['theme']>
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
        )
      }
    },
    state: textState,
    onKeyDown() {
      return false
    },
    isEmpty: state => {
      const value = Value.fromJSON(state)
      return isValueEmpty(value)
    }
  }
}

type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends (infer U)[]
    ? DeepPartial<U>[]
    : T[P] extends readonly (infer U)[]
    ? readonly DeepPartial<U>[]
    : DeepPartial<T[P]>
}
