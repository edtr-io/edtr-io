/**
 * @module @edtr-io/store
 */
/** Comment needed because of https://github.com/christopherthielen/typedoc-plugin-external-module-name/issues/337 */
import { EditorPlugin } from '@edtr-io/internal__plugin'
import { StoreSerializeHelpers } from '@edtr-io/internal__plugin-state'
import * as R from 'ramda'
import { createSelectorCreator, defaultMemoize } from 'reselect'

import { createSelector, createSubReducer } from '../helpers'
import { getPlugin } from '../plugins/reducer'
import { DocumentState, ScopedState } from '../types'
import {
  pureInsert,
  PureInsertAction,
  RemoveAction,
  pureChange,
  PureChangeAction,
  pureRemove,
  pureReplace,
  PureReplaceAction
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
          state: pluginState
        }
      }
    },
    [pureRemove.type](documentState, action: RemoveAction) {
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
    },
    [pureReplace.type](documentState, action: PureReplaceAction) {
      const { id, newId, document } = action.payload
      if (!documentState[id]) return documentState

      return {
        ...documentState,
        [newId]: documentState[id],
        [id]: document
      }
    }
  }
)

export const getDocuments = createSelector(state => state.documents)

export const getDocument = createSelector((state, id: string | null) => {
  if (!id) return null
  return getDocuments()(state)[id] || null
})

const createDeepEqualSelector = createSelectorCreator(defaultMemoize, R.equals)

export const serializeDocument = (id: string | null) =>
  createDeepEqualSelector(
    (state: ScopedState) => {
      const doc = getDocument(id)(state)
      if (!doc) return null
      const plugin = getPlugin(doc.plugin)(state)
      if (!plugin) return null
      const serializeHelpers: StoreSerializeHelpers = {
        getDocument: (id: string) => serializeDocument(id)(state)
      }
      return {
        plugin: doc.plugin,
        state: plugin.state.serialize(doc.state, serializeHelpers)
      }
    },
    s => s
  )

export const isEmpty = createSelector((state, id: string) => {
  const doc = getDocument(id)(state)
  if (!doc) return false
  const plugin = getPlugin(doc.plugin)(state)
  return isDocumentEmpty(doc, plugin)
})

export function isDocumentEmpty(
  doc: DocumentState | null,
  plugin: EditorPlugin | null
) {
  if (!doc || !plugin) return false

  if (typeof plugin.isEmpty === 'function') {
    return plugin.isEmpty(doc.state)
  }

  const initialState = plugin.state.createInitialState({
    createDocument: () => {}
  })
  return R.equals(doc.state, initialState)
}
