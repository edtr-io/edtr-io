import { Editor, MarkJSON, NodeJSON } from 'slate'
import { Rule } from 'slate-html-serializer'
import {
  EditorProps,
  Plugin,
  RenderMarkProps,
  RenderNodeProps
} from 'slate-react'
import { plugins } from './plugins'
import { createTextPlugin } from './factory'
import { createUiPlugin, Controls } from './controls'
import { createPluginTheme } from '@edtr-io/ui'

export type MarkEditorProps = RenderMarkProps

export interface MarkRendererProps {
  mark: MarkJSON
}

export type NodeEditorProps = RenderNodeProps
export type NodeControlsProps = EditorProps & {
  editor: Editor
}
export interface NodeRendererProps {
  node: NodeJSON
}

export type TextPlugin = Plugin & Rule & { onKeyDownHandlers?: string[] }

export const textPlugin = createTextPlugin({
  plugins: [...plugins, createUiPlugin({ Component: Controls })],
  placeholder: 'Write some text here...'
})

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
}

export const createTextPluginTheme = createPluginTheme<TextTheme>(theme => {
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
    }
  }
})

export * from './factory'
