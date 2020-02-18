import * as InternalPluginToolbar from '@edtr-io/internal__plugin-toolbar/beta'
import * as React from 'react'

/** @public */
export const PluginToolbarContext = React.createContext<PluginToolbar>(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  undefined as any
)
/** @public */
export type PluginToolbar = InternalPluginToolbar.PluginToolbar
