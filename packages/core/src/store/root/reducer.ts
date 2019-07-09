import { createSubReducer } from '../helpers'
import { DocumentState, ScopeState } from '../types'
import { pureInitRoot, PureInitRootAction } from './actions'

import { serializeDocument } from '../documents/reducer'

export const rootReducer = createSubReducer('root', null, {
  [pureInitRoot.type](_rootState, _action: PureInitRootAction) {
    return 'root'
  }
})

export function getRoot(state: ScopeState) {
  return state.root
}
export function serializeRootDocument(state: ScopeState): DocumentState | null {
  const root = getRoot(state)

  return root ? serializeDocument(state, root) : null
}

export const publicRootSelectors = {
  getRoot,
  serializeRootDocument
}
