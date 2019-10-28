import { Plugin } from '@edtr-io/plugin'
import { DocumentState } from '@edtr-io/store'
import * as React from 'react'

import { SlateEditorAdditionalProps } from './editor'
import { TextPlugin, PluginRegistry } from '..'

export interface TextPluginConfig {
  placeholder: string
  registry: PluginRegistry
  plugins: ((pluginClosure: SlatePluginClosure) => TextPlugin)[]
}

export type SlatePluginClosure = React.RefObject<{
  name: string
  parent?: SlateEditorAdditionalProps
  replace?: (options?: DocumentState) => void
  availablePlugins: PluginRegistry
  plugins: Record<string, Plugin>
}>
