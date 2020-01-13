import {
  DocumentState,
  getPlugins,
  ReturnTypeFromSelector
} from '@edtr-io/store'
import * as React from 'react'

import { SlateEditorAdditionalProps } from './editor'
import { TextConfig } from '..'

/** @public */
export type SlatePluginClosure = React.RefObject<{
  config: TextConfig
  name: string
  parent?: SlateEditorAdditionalProps
  replace?: (options?: DocumentState) => void
  availablePlugins: TextConfig['registry']
  plugins: ReturnTypeFromSelector<typeof getPlugins>
}>
