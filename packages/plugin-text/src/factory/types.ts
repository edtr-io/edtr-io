import * as React from 'react'
import { Value, ValueJSON } from 'slate'
import { Plugin } from 'slate-react'
import { Rule } from 'slate-html-serializer'

export interface TextPluginOptions {
  plugins: (Plugin & Rule)[]
  placeholder?: React.ReactNode
}

export interface TextPluginState {
  editorState: Value
}

export interface TextPluginSerializedState {
  importFromHtml?: string
  editorState?: ValueJSON
}
