import * as React from 'react'

import { TextConfigPlugin } from './types'

/** @internal */
export const RegistryContext = React.createContext<Registry>(
  undefined as unknown as Registry
)
/** @internal */
export type Registry = {
  name: TextConfigPlugin
  title?: string
  icon?: React.ComponentType
  description?: string
}[]
