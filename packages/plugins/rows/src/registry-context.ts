import * as React from 'react'

/** @internal */
export const RegistryContext = React.createContext<Registry>([])

/** @internal */
export type Registry = {
  name: string
  title?: string
  icon?: React.ComponentType
  description?: string
}[]
