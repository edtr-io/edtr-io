import { createSubReducer } from '../helpers'
import { DocumentState, State } from '../types'
import { initRoot, InitRootAction } from './actions'

import { serializeDocument } from '../documents/reducer'

export const rootReducer = createSubReducer('root', null, {
  [initRoot.type](_state, _action: InitRootAction) {
    return 'root'
  }
})

export function getRoot(state: State) {
  return state.root
}

export function serializeRootDocument(state: State): DocumentState | null {
  const root = getRoot(state)

  return root ? serializeDocument(state, root) : null
}
