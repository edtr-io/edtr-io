import { useScopedStore } from '@edtr-io/core'
import * as React from 'react'

import { TextPluginConfig, TextProps } from '..'

/** @public */
export type SlatePluginClosure = React.RefObject<SlateClosure>

/** @public */
export interface SlateClosure {
  id: TextProps['id']
  config: TextPluginConfig
  store: ReturnType<typeof useScopedStore>
}
