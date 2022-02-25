import * as InternalPluginToolbar from '@edtr-io/internal__plugin-toolbar/beta'
import * as React from 'react'

/** @public */
export const PluginToolbarContext = React.createContext<PluginToolbar>(
  undefined as unknown as PluginToolbar
)
/** @public */
export type PluginToolbar = InternalPluginToolbar.PluginToolbar
