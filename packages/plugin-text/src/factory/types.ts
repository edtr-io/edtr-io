import { OverlayContextValue } from '@edtr-io/core'
import { Plugin } from '@edtr-io/plugin'
import { DocumentState } from '@edtr-io/store'
import * as React from 'react'

import { SlateEditorAdditionalProps } from './editor'
import { TextPlugin, PluginRegistry } from '..'

export interface TextPluginOptions {
  plugins: ((pluginClosure: SlatePluginClosure) => TextPlugin)[]
  registry?: PluginRegistry
  placeholder?: React.ReactNode
}

export type SlatePluginClosure = React.RefObject<{
  overlayContext: OverlayContextValue
  name: string
  parent?: SlateEditorAdditionalProps
  replace?: (options?: DocumentState) => void
  availablePlugins: PluginRegistry
  plugins: Record<string, Plugin>
}>
