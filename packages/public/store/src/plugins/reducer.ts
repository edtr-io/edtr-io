/**
 * @module @edtr-io/store
 */
/** Comment needed because of https://github.com/christopherthielen/typedoc-plugin-external-module-name/issues/337 */
import { EditorPlugin } from '@edtr-io/internal__plugin'

import { createSelector, createSubReducer } from '../helpers'

/** @internal */
export const pluginsReducer = createSubReducer(
  'plugins',
  { defaultPlugin: '', plugins: {} },
  {}
)

/** @public */
export const getDefaultPlugin = createSelector(
  state => state.plugins.defaultPlugin
)
/** @public */
export const getPlugins = createSelector(state => state.plugins.plugins)
/** @public */
export const getPlugin = createSelector(
  (state, type: string): EditorPlugin | null => {
    const plugins = getPlugins()(state)
    return plugins[type] || null
  }
)
/** @public */
export const getPluginTypeOrDefault = createSelector(
  (state, type: string = getDefaultPlugin()(state)) => type
)
/** @public */
export const getPluginOrDefault = createSelector(
  (state, type: string = getDefaultPlugin()(state)) => getPlugin(type)(state)
)
