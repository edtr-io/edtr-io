import * as R from 'ramda'

import { isStatefulPlugin, isStatelessPlugin } from '../../plugin'
import { createSubReducer } from '../helpers'
import { DocumentState, EditorState } from '../types'
import {
  pureInsert,
  PureInsertAction,
  remove,
  RemoveAction,
  pureChange,
  PureChangeAction
} from './actions'

import { getPlugin } from '../plugins/reducer'
import { StoreSerializeHelpers } from '../../plugin-state'

export const documentsReducer = createSubReducer(
  'documents',
  {},
  {
    [pureInsert.type](documentState, action: PureInsertAction, state) {
      const { id, plugin: type, state: pluginState } = action.payload
      const plugin = getPlugin(state, type)
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

export function getDocuments(state: EditorState) {
  return state.documents
}

export function getDocument(
  state: EditorState,
  id: string | null
): DocumentState | null {
  if (!id) return null
  return getDocuments(state)[id] || null
}

export function serializeDocument(
  state: EditorState,
  id: string | null
): DocumentState | null {
  const doc = getDocument(state, id)
  if (!doc) return null
  const plugin = getPlugin(state, doc.plugin)
  if (!plugin) return null
  const serializeHelpers: StoreSerializeHelpers = {
    getDocument: (id: string) => serializeDocument(state, id)
  }
  return {
    plugin: doc.plugin,
    ...(isStatelessPlugin(plugin)
      ? {}
      : { state: plugin.state.serialize(doc.state, serializeHelpers) })
  }
}

export function isEmpty(state: EditorState, id: string) {
  const doc = getDocument(state, id)
  if (!doc) return false
  const plugin = getPlugin(state, doc.plugin)
  if (!plugin || isStatelessPlugin(plugin)) return false

  if (typeof plugin.isEmpty === 'function') {
    return plugin.isEmpty(doc.state)
  }

  const initialState = plugin.state.createInitialState({
    createDocument: () => {}
  })
  return R.equals(doc.state, initialState)
}

export const publicDocumentsSelectors = {
  getDocument,
  serializeDocument,
  isEmpty
}
