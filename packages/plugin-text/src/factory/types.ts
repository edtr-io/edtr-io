import * as React from 'react'
import { OverlayContextValue } from '@edtr-io/core'
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
}>
