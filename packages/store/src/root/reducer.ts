import { serializeDocument } from '../documents/reducer'
import { createSelector, createSubReducer } from '../helpers'
import { pureInitRoot, PureInitRootAction } from './actions'

export const rootReducer = createSubReducer('root', null, {
  [pureInitRoot.type](_rootState, _action: PureInitRootAction) {
    return 'root'
  }
})

export const getRoot = createSelector(state => state.root)
export const serializeRootDocument = createSelector(state => {
  const root = getRoot()(state)
  return root ? serializeDocument(root)(state) : null
})
