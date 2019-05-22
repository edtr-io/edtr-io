import * as React from 'react'
import { OverlayContextValue, Plugin, PluginState } from '@edtr-io/core'
import { TextPlugin } from '..'
import { SlateEditorAdditionalProps } from './editor'

export interface TextPluginOptions {
  plugins: ((pluginClosure: SlatePluginClosure) => TextPlugin)[]
  placeholder?: React.ReactNode
}

export type SlatePluginClosure = React.RefObject<{
  overlayContext: OverlayContextValue
  name: string
  parent?: SlateEditorAdditionalProps
  replace?: (options?: PluginState) => void
  plugins: Record<string, Plugin>
}>
