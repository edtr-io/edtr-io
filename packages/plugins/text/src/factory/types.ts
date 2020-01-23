import { useScopedStore } from '@edtr-io/core'
import * as React from 'react'

import { TextConfig, TextProps } from '..'

/** @public */
export type SlatePluginClosure = React.RefObject<SlateClosure>

/** @public */
export interface SlateClosure {
  id: TextProps['id']
  config: TextConfig
  store: ReturnType<typeof useScopedStore>
}
