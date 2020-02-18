import { EditorPlugin } from '@edtr-io/internal__plugin'

import { createSelector, createSubReducer, SubReducer } from '../helpers'
import { Selector } from '../types'

/** @internal */
export const pluginsReducer: SubReducer<Record<
  string,
  EditorPlugin
>> = createSubReducer('plugins', {}, {})

/** @public */
export const getPlugins: Selector<Record<
  string,
  EditorPlugin
>> = createSelector(state => state.plugins)
/** @public */
export const getPlugin = createSelector(
  (state, type: string): EditorPlugin | null => {
    const plugins = getPlugins()(state)
    return plugins[type] || null
  }
)
