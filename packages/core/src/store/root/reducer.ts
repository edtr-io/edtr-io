import { createSubReducer } from '../helpers'
import { DocumentState, EditorState } from '../types'
import { initRoot, InitRootAction } from './actions'

import { serializeDocument } from '../documents/reducer'

export const rootReducer = createSubReducer('root', null, {
  [initRoot.type](_rootState, _action: InitRootAction) {
    return 'root'
  }
})

export function getRoot(state: EditorState) {
  return state.root
}
export function serializeRootDocument(
  state: EditorState
): DocumentState | null {
  const root = getRoot(state)

  return root ? serializeDocument(state, root) : null
}

export const publicRootSelectors = {
  getRoot,
  serializeRootDocument
}
