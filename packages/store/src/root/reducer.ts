/**
 * @module @edtr-io/store
 */
/** Comment needed because of https://github.com/christopherthielen/typedoc-plugin-external-module-name/issues/337 */
import { serializeDocument } from '../documents/reducer'
import { createSelector, createSubReducer } from '../helpers'
import { ReturnTypeFromSelector } from '../types'
import { pureInitRoot, PureInitRootAction } from './actions'

export const rootReducer = createSubReducer('root', null, {
  [pureInitRoot.type](_rootState, _action: PureInitRootAction) {
    return 'root'
  }
})

export const getRoot = createSelector(state => state.root)
export const serializeRootDocument = createSelector(
  (state): ReturnTypeFromSelector<typeof serializeDocument> => {
    const root = getRoot()(state)
    if (!root) return null
    return serializeDocument(root)(state)
  }
)
