import { EditorPlugin } from '@edtr-io/internal__plugin'

import { createSelector, createSubReducer, SubReducer } from '../helpers'
import { Selector } from '../types'

/** @internal */
export const pluginsReducer: SubReducer<{
  defaultPlugin: string
  plugins: Record<string, EditorPlugin>
}> = createSubReducer('plugins', { defaultPlugin: '', plugins: {} }, {})

/** @public */
export const getDefaultPlugin: Selector<string> = createSelector(
  state => state.plugins.defaultPlugin
)
/** @public */
export const getPlugins: Selector<Record<
  string,
  EditorPlugin
>> = createSelector(state => state.plugins.plugins)
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
