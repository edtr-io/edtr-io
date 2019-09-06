import { serializeDocument } from '../documents/reducer'
import { createSubReducer } from '../helpers'
import { DocumentState, ScopedState } from '../types'
import { pureInitRoot, PureInitRootAction } from './actions'

export const rootReducer = createSubReducer('root', null, {
  [pureInitRoot.type](_rootState, _action: PureInitRootAction) {
    return 'root'
  }
})

export function getRoot(state: ScopedState) {
  return state.root
}
export function serializeRootDocument(
  state: ScopedState
): DocumentState | null {
  const root = getRoot(state)

  return root ? serializeDocument(state, root) : null
}
