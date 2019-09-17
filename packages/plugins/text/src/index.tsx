import { createPluginTheme, PluginThemeFactory } from '@edtr-io/ui'
import * as React from 'react'
import {
  BlockJSON,
  Editor,
  InlineJSON,
  MarkJSON,
  Range as CoreRange
} from 'slate'
import { Rule } from 'slate-html-serializer'
import {
  EditorProps,
  Plugin,
  RenderBlockProps,
  RenderInlineProps,
  RenderMarkProps
} from 'slate-react'

import { createUiPlugin, Controls } from './controls'
import { createTextPlugin as textPluginFactory } from './factory'
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

export function createTextPlugin(registry?: PluginRegistry) {
  return textPluginFactory({
    registry,
    plugins: [...plugins, createUiPlugin({ Component: Controls })],
    placeholder: 'Schreibe etwas oder füge mit \u2295 Elemente hinzu.'
  })
}

export const textPlugin = createTextPlugin()

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

export function trimSelection(editor: Editor) {
  // Trimm selection before applying transformation
  const selection = document.getSelection()
  if (selection) {
    let str = selection.toString()
    while (str.startsWith(' ')) {
      editor.moveStartForward(1)
      str = str.substring(1)
    }
    while (str.endsWith(' ')) {
      editor.moveEndBackward(1)
      str = str.substring(0, str.length - 1)
    }
  }
}

export function getTrimmedSelectionRange(editor: Editor) {
  // get trimmed selection, without changing editor (e.g. for checking active marks)
  const native = document.getSelection()
  let selection = editor.value.selection.toRange()
  if (native) {
    let str = native.toString()
    while (str.startsWith(' ')) {
      selection = selection.moveStartForward(1)
      str = str.substring(1)
    }
    while (str.endsWith(' ')) {
      selection = selection.moveEndBackward(1)
      str = str.substring(0, str.length - 1)
    }
  }
  return CoreRange.create(selection)
}

export { defaultNode, isValueEmpty, textState } from './factory'
