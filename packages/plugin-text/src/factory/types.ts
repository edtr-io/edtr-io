import * as React from 'react'
import { OverlayContextValue } from '@edtr-io/core'
import { TextPlugin } from '..'

export interface TextPluginOptions {
  plugins: ((pluginClosure: SlatePluginClosure) => TextPlugin)[]
  placeholder?: React.ReactNode
}

export type SlatePluginClosure = React.RefObject<{
  overlayContext: OverlayContextValue
}>
