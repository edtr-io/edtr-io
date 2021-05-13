import { EditorPlugin } from '@edtr-io/internal__plugin'
import { StateType } from '@edtr-io/internal__plugin-state'

import { createSelector, createSubReducer, SubReducer } from '../helpers'
import { Selector } from '../types'

/** @internal */
export const pluginsReducer: SubReducer<Record<string, EditorPlugin>> =
  createSubReducer('plugins', {}, {})

/** @public */
export const getPlugins: Selector<
  Record<
    string,
    // TODO: This is a workaround until API extractor supports import() types, see https://github.com/microsoft/rushstack/pull/1916
    EditorPlugin<StateType>
  >
> = createSelector((state) => state.plugins)
/** @public */
export const getPlugin = createSelector(
  (state, type: string): EditorPlugin | null => {
    const plugins = getPlugins()(state)
    return plugins[type] || null
  }
)
