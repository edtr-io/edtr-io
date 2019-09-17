/**
 * @module @edtr-io/core
 */
/** Comment needed because of https://github.com/christopherthielen/typedoc-plugin-external-module-name/issues/337 */
import { PluginToolbar } from '@edtr-io/internal__plugin-toolbar'
import * as React from 'react'

/**
 * @ignore
 */
export const PluginToolbarContext = React.createContext<PluginToolbar>(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  undefined as any
)
