import { createSubReducer } from '../helpers'
import { DocumentState, EditorState, StoreState } from '../types'
import { initRoot, InitRootAction } from './actions'

import { publicSerializeDocument } from '../documents/reducer'

export const rootReducer = createSubReducer('root', null, {
  [initRoot.type](_rootState, _action: InitRootAction) {
    return 'root'
  }
})

export function getRoot(state: StoreState, scope: string) {
  return publicGetRoot(state[scope])
}

export function publicGetRoot(state: EditorState) {
  return state.root
}
export function serializeRootDocument(state: StoreState, scope: string) {
  return publicSerializeRootDocument(state[scope])
}

export function publicSerializeRootDocument(
  state: EditorState
): DocumentState | null {
  const root = publicGetRoot(state)

  return root ? publicSerializeDocument(state, root) : null
}

export const publicRootSelectors = {
  getRoot: publicGetRoot,
  serializeRootDocument: publicSerializeRootDocument
}
