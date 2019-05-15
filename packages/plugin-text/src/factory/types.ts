import * as React from 'react'
import { OverlayContextValue, Plugin } from '@edtr-io/core'
import { TextPlugin } from '..'
import { SlateEditorAdditionalProps } from './editor'
import { StateDescriptor } from '@edtr-io/core/src/plugin-state'

export interface TextPluginOptions {
  plugins: ((pluginClosure: SlatePluginClosure) => TextPlugin)[]
  placeholder?: React.ReactNode
}

export type SlatePluginClosure = React.RefObject<{
  overlayContext: OverlayContextValue
  name: string
  parent?: SlateEditorAdditionalProps
  replace?:
    | ((
        options?:
          | {
              plugin: string
              state?: unknown
            }
          | undefined
      ) => void)
    | undefined
  plugins: Record<
    string,
    Plugin<StateDescriptor<unknown, unknown, unknown>, any>
  >
}>
