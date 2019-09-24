/**
 * @module @edtr-io/store
 */
/** Comment needed because of https://github.com/christopherthielen/typedoc-plugin-external-module-name/issues/337 */
import { Plugin } from '@edtr-io/abstract-plugin'

import { createSelector, createSubReducer } from '../helpers'

export const pluginsReducer = createSubReducer(
  'plugins',
  { defaultPlugin: '', plugins: {} },
  {}
)

export const getDefaultPlugin = createSelector(
  state => state.plugins.defaultPlugin
)
export const getPlugins = createSelector(state => state.plugins.plugins)
export const getPlugin = createSelector(
  (state, type: string): Plugin | null => {
    const plugins = getPlugins()(state)
    return plugins[type] || null
  }
)
export const getPluginTypeOrDefault = createSelector(
  (state, type: string = getDefaultPlugin()(state)) => type
)
export const getPluginOrDefault = createSelector(
  (state, type: string = getDefaultPlugin()(state)) => getPlugin(type)(state)
)
