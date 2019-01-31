import { produce } from 'immer'

export enum StateActionType {
  Insert = 'Insert',
  Change = 'Change'
}

export function createStateReducer(options: StateReducerOptions) {
  return stateReducer

  function stateReducer(
    state: EditorState = {},
    action?: StateAction
  ): EditorState {
    return produce(state, draft => {
      handleInsert()
      handleChange()

      function handleInsert() {
        if (action && action.type === StateActionType.Insert) {
          const id = options.generateId()

          draft[id] = {
            type: action.payload || options.defaultPlugin
          }
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
  generateId: () => string
}

export interface EditorState {
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

type PluginType = string

export interface Plugin {
  type: PluginType
  state?: unknown
}
