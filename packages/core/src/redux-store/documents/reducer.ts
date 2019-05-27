import * as R from 'ramda'

import { isStatefulPlugin, isStatelessPlugin } from '../../plugin'
import { createSubReducer } from '../helpers'
import { DocumentState, State } from '../types'
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
    [pureInsert.type](state, action: PureInsertAction, s) {
      if (!s) {
        return state // FIXME: can we guarantee that this does indeed exist?? we should be able to!
      }
      const { id, plugin: type, state: pluginState } = action.payload
      const plugin = getPlugin(s, type)

      if (!plugin) {
        return state
      }

      // FIXME: const history = commit(state, action)

      return {
        ...state,
        [id]: {
          plugin: type,
          state: isStatefulPlugin(plugin) ? pluginState : undefined
        }
      }
    },
    [remove.type](state, action: RemoveAction) {
      return R.omit([action.payload], state)
    },
    [pureChange.type](state, action: PureChangeAction) {
      const { id, state: pluginState } = action.payload

      if (!state[id]) {
        //TODO: console.warn: Missing Id
        return state
      }

      return {
        [id]: {
          ...state[id],
          state: pluginState
        }
      }
    }
  }
)

export function getDocuments(state: State) {
  return state.documents
}

export function getDocument(
  state: State,
  id: string | null
): DocumentState | null {
  if (!id) return null
  return getDocuments(state)[id] || null
}

export function serializeDocument(
  state: State,
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
