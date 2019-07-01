import * as R from 'ramda'

import { isStatefulPlugin, isStatelessPlugin } from '../../plugin'
import { createSubReducer } from '../helpers'
import { DocumentState, EditorState, StoreState } from '../types'
import {
  pureInsert,
  PureInsertAction,
  remove,
  RemoveAction,
  pureChange,
  PureChangeAction
} from './actions'

import { publicGetPlugin } from '../plugins/reducer'
import { StoreSerializeHelpers } from '../../plugin-state'

export const documentsReducer = createSubReducer(
  'documents',
  {},
  {
    [pureInsert.type](documentState, action: PureInsertAction, state) {
      const { id, plugin: type, state: pluginState } = action.payload
      const plugin = publicGetPlugin(state, type)
      if (!plugin) return documentState

      return {
        ...documentState,
        [id]: {
          plugin: type,
          state: isStatefulPlugin(plugin) ? pluginState : undefined
        }
      }
    },
    [remove.type](documentState, action: RemoveAction) {
      return R.omit([action.payload], documentState)
    },
    [pureChange.type](documentState, action: PureChangeAction) {
      const { id, state: pluginState } = action.payload
      if (!documentState[id]) return documentState

      return {
        ...documentState,
        [id]: {
          ...documentState[id],
          state: pluginState
        }
      }
    }
  }
)

export function publicGetDocuments(state: EditorState) {
  return state.documents
}

export function publicGetDocument(
  state: EditorState,
  id: string | null
): DocumentState | null {
  if (!id) return null
  return publicGetDocuments(state)[id] || null
}

export function publicSerializeDocument(
  state: EditorState,
  id: string | null
): DocumentState | null {
  const doc = publicGetDocument(state, id)
  if (!doc) return null
  const plugin = publicGetPlugin(state, doc.plugin)
  if (!plugin) return null
  const serializeHelpers: StoreSerializeHelpers = {
    getDocument: (id: string) => publicSerializeDocument(state, id)
  }
  return {
    plugin: doc.plugin,
    ...(isStatelessPlugin(plugin)
      ? {}
      : { state: plugin.state.serialize(doc.state, serializeHelpers) })
  }
}

export function publicIsEmpty(state: EditorState, id: string) {
  const doc = publicGetDocument(state, id)
  if (!doc) return false
  const plugin = publicGetPlugin(state, doc.plugin)
  if (!plugin || isStatelessPlugin(plugin)) return false

  if (typeof plugin.isEmpty === 'function') {
    return plugin.isEmpty(doc.state)
  }

  const initialState = plugin.state.createInitialState({
    createDocument: () => {}
  })
  return R.equals(doc.state, initialState)
}

export function getDocuments(state: StoreState, scope: string) {
  return publicGetDocuments(state[scope])
}
export function getDocument(
  state: StoreState,
  scope: string,
  id: string | null
) {
  return publicGetDocument(state[scope], id)
}
export function serializeDocument(
  state: StoreState,
  scope: string,
  id: string | null
) {
  return publicSerializeDocument(state[scope], id)
}
export function isEmpty(state: StoreState, scope: string) {
  return publicGetDocuments(state[scope])
}

export const publicDocumentsSelectors = {
  getDocument: publicGetDocument,
  serializeDocument: publicSerializeDocument,
  isEmpty: publicIsEmpty
}
