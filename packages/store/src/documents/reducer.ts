import {
  isStatefulPlugin,
  isStatelessPlugin,
  Plugin
} from '@edtr-io/abstract-plugin'
import { StoreSerializeHelpers } from '@edtr-io/abstract-plugin-state'
import * as R from 'ramda'

import { createSelector, createSubReducer } from '../helpers'
import { getPlugin } from '../plugins/reducer'
import { DocumentState } from '../types'
import {
  pureInsert,
  PureInsertAction,
  remove,
  RemoveAction,
  pureChange,
  PureChangeAction
} from './actions'

export const documentsReducer = createSubReducer(
  'documents',
  {},
  {
    [pureInsert.type](documentState, action: PureInsertAction, state) {
      const { id, plugin: type, state: pluginState } = action.payload
      const plugin = getPlugin(type)(state)
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

export const getDocuments = createSelector(state => state.documents)

export const getDocument = createSelector((state, id: string | null) => {
  if (!id) return null
  return getDocuments()(state)[id] || null
})

export const serializeDocument = createSelector((state, id: string | null) => {
  const doc = getDocument(id)(state)
  if (!doc) return null
  const plugin = getPlugin(doc.plugin)(state)
  if (!plugin) return null
  const serializeHelpers: StoreSerializeHelpers = {
    getDocument: (id: string) => serializeDocument(id)(state)
  }
  return {
    plugin: doc.plugin,
    ...(isStatelessPlugin(plugin)
      ? {}
      : { state: plugin.state.serialize(doc.state, serializeHelpers) })
  }
})

export const isEmpty = createSelector((state, id: string) => {
  const doc = getDocument(id)(state)
  if (!doc) return false
  const plugin = getPlugin(doc.plugin)(state)
  return isDocumentEmpty(doc, plugin)
})

export function isDocumentEmpty(
  doc: DocumentState | null,
  plugin: Plugin | null
) {
  if (!doc || !plugin || isStatelessPlugin(plugin)) return false

  if (typeof plugin.isEmpty === 'function') {
    return plugin.isEmpty(doc.state)
  }

  const initialState = plugin.state.createInitialState({
    createDocument: () => {}
  })
  return R.equals(doc.state, initialState)
}
