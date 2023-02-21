import * as React from 'react'

import type { TextPlugin } from './types'

/** @internal */
export const RegistryContext = React.createContext<Registry>(
  undefined as unknown as Registry
)
/** @internal */
export type Registry = {
  name: TextPlugin
  title?: string
  icon?: React.ComponentType
  description?: string
}[]
