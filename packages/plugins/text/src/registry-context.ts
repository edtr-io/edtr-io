import * as React from 'react'

import type { TextEditorPlugin } from './types'

/** @internal */
export const RegistryContext = React.createContext<Registry>(
  undefined as unknown as Registry
)
/** @internal */
export type Registry = {
  name: TextEditorPlugin
  title?: string
  icon?: React.ComponentType
  description?: string
}[]
