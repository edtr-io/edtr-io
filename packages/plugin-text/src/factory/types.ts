import { OverlayContextValue, Plugin, DocumentState } from '@edtr-io/core'
import * as React from 'react'

import { SlateEditorAdditionalProps } from './editor'
import { TextPlugin } from '..'

export interface TextPluginOptions {
  plugins: ((pluginClosure: SlatePluginClosure) => TextPlugin)[]
  placeholder?: React.ReactNode
}

export type SlatePluginClosure = React.RefObject<{
  overlayContext: OverlayContextValue
  name: string
  parent?: SlateEditorAdditionalProps
  replace?: (options?: DocumentState) => void
  plugins: Record<string, Plugin>
}>
