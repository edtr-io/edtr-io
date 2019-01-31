import { produce } from 'immer'

import { PluginRegistry } from './plugin-registry'
import { isStatefulPlugin } from '..'

export enum StateActionType {
  Insert = 'Insert',
  Remove = 'Remove',
  Change = 'Change'
}

export function createStateReducer(options: StateReducerOptions) {
  return stateReducer

  function stateReducer(
    state: Reducer,
    action?: StateAction
  ): Reducer {
    return produce(state, draft => {
      handleInsert()
      handleRemove()
      handleChange()

      function handleInsert() {
        if (action && action.type === StateActionType.Insert) {
          const type = action.payload || options.defaultPlugin
          const id = options.generateId()

          const plugin = options.registry.getPlugin(type)

          let state
          if (plugin && isStatefulPlugin(plugin)) {
            state = plugin.createInitialState()
          }

          draft[id] = {
            type: action.payload || options.defaultPlugin,
            state
          }
        }
      }

      function handleRemove() {
        if (action && action.type === StateActionType.Remove) {
          delete draft[action.payload]
        }
      }

      function handleChange() {
        if (action && action.type === StateActionType.Change) {
          const { id, state } = action.payload

          if (!draft[id]) {
            //TODO: console.warn: Missing Id
            return
          }

          draft[id].state = {
            ...draft[id].state,
            ...state
          }
        }
      }
    })
  }
}

export interface StateReducerOptions {
  defaultPlugin: PluginType
  registry: PluginRegistry<PluginType>
  generateId: () => string
}

export interface Reducer {
  [key: string]: Plugin
}

export type StateAction =
  | {
      type: StateActionType.Insert
      payload?: PluginType
    }
  | {
      type: StateActionType.Change
      payload: {
        id: string
        state: unknown
      }
    }
  | {
      type: StateActionType.Remove
      payload: string
    }

type PluginType = string

interface Plugin {
  type: PluginType
  state?: unknown
}
