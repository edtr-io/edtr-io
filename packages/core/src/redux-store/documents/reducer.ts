import * as R from 'ramda'

import { isStatefulPlugin } from '../../plugin'
import { createSubReducer } from '../helpers'
import { DocumentState, State } from '../types'
import {
  insert,
  InsertAction,
  remove,
  RemoveAction,
  change,
  ChangeAction
} from './actions'

import { getPlugin } from '../plugins/reducer'

export const documentsReducer = createSubReducer(
  'documents',
  {},
  {
    [insert.type](state, action: InsertAction, s) {
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
    [change.type](state, action: ChangeAction) {
      const { id, state: pluginState } = action.payload

      if (!state[id]) {
        //TODO: console.warn: Missing Id
        return state
      }

      // FIXME: commit (probably in saga)

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

export function getDocument(state: State, id: string): DocumentState | null {
  return getDocuments(state)[id] || null
}
