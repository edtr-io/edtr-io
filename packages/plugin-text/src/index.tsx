import * as React from 'react'
import { MarkJSON, NodeJSON, Value } from 'slate'
import { Rule } from 'slate-html-serializer'
import { Plugin, RenderMarkProps, RenderNodeProps } from 'slate-react'
import { plugins } from './plugins'
import { createTextPlugin } from './factory'
import { createUiPlugin, Controls } from './controls'

export type MarkEditorProps = RenderMarkProps

export interface MarkRendererProps {
  mark: MarkJSON
}

export type NodeEditorProps = RenderNodeProps

export interface NodeRendererProps {
  node: NodeJSON
}

export type TextPlugin = Plugin & Rule

export const textPlugin = createTextPlugin({
  plugins: [...plugins, createUiPlugin({ Component: Controls })],
  placeholder: 'Write some text here...'
})

export * from './factory'
