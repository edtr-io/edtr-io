export enum StateActionType {
  Insert = 'Insert'
}

export function createStateReducer(options: StateReducerOptions) {
  return stateReducer

  function stateReducer(
    state: EditorState = {},
    action?: StateAction
  ): EditorState {
    if (!action) {
      return state
    }
    switch (action.type) {
      case StateActionType.Insert: {
        const id = options.generateId()

        return {
          ...state,
          [id]: {
            type: action.payload || options.defaultPlugin
          }
        }
      }
      default:
        return state
    }
  }
}

export interface StateReducerOptions {
  defaultPlugin: PluginType
  generateId: () => string
}

export interface EditorState {
  [key: string]: unknown
}

export type StateAction = {
  type: StateActionType.Insert
  payload?: PluginType
}

type PluginType = string
