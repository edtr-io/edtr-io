import { EditorPluginProps, scalar } from '@edtr-io/plugin'
import { createPluginTheme, PluginThemeFactory } from '@edtr-io/ui'
import * as React from 'react'
import { BlockJSON, Editor, InlineJSON, MarkJSON, ValueJSON } from 'slate'
import { Rule } from 'slate-html-serializer' // TODO: Remove this reference
import {
  EditorProps,
  Plugin,
  RenderBlockProps,
  RenderInlineProps,
  RenderMarkProps
} from 'slate-react'

import { createUiPlugin, Controls } from './controls'
import { createTextPlugin as textPluginFactory } from './factory'
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

export type PluginRegistry = {
  name: string
  title?: string
  icon?: React.ComponentType
  description?: string
}[]

export interface TextTheme {
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
  plugins: {
    colors: {
      colors: string[]
      defaultColor: string
    }
  }
}

export const textPluginThemeFactory: PluginThemeFactory<TextTheme> = theme => {
  const blue = '#1794c1',
    green = '#469a40',
    orange = '#ff6703'
  return {
    backgroundColor: 'transparent',
    color: theme.editor.color,
    hoverColor: theme.editor.primary.background,
    active: {
      backgroundColor: '#b6b6b6',
      color: theme.editor.backgroundColor
    },
    dropDown: {
      backgroundColor: theme.editor.backgroundColor
    },
    plugins: {
      colors: {
        colors: [blue, green, orange],
        defaultColor: 'black'
      }
    }
  }
}
export const createTextPluginTheme = createPluginTheme<TextTheme>(
  textPluginThemeFactory
)

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
}
export type TextProps = EditorPluginProps<TextState, TextConfig>

export function createTextPlugin({
  placeholder = 'Schreibe etwas oder füge mit \u2295 Elemente hinzu.',
  registry
}: {
  placeholder?: TextConfig['placeholder']
  registry: TextConfig['registry']
}) {
  return textPluginFactory({
    registry,
    plugins: [...plugins, createUiPlugin({ Component: Controls })],
    placeholder
  })
}
