import { produce } from 'immer'

// import { PluginRegistry } from './plugin-registry'
import { isStatefulPlugin, Plugin } from '..'

export enum ActionType {
  Insert = 'Insert',
  Remove = 'Remove',
  Change = 'Change',
  Focus = 'Focus'
}

export function reducer(state: State, action: Action): State {
  return produce(state, draft => {
    handleInsert()
    handleRemove()
    handleChange()
    handleFocus()

    function handleInsert() {
      if (action.type === ActionType.Insert) {
        const type = action.payload.plugin || getDefaultPlugin(draft)
        const id = action.payload.id

        const plugin = getPlugin(draft, type)

        let state
        if (plugin && isStatefulPlugin(plugin)) {
          state = action.payload.state || plugin.createInitialState()
        }

        draft.focus = id
        draft.documents[id] = {
          plugin: type,
          state
        }
      }
    }

    function handleRemove() {
      if (action.type === ActionType.Remove) {
        delete draft.documents[action.payload]
      }
    }

    function handleChange() {
      if (action.type === ActionType.Change) {
        const { id, state } = action.payload

        if (!draft.documents[id]) {
          //TODO: console.warn: Missing Id
          return
        }

        draft.documents[id].state = {
          ...draft.documents[id].state,
          ...state
        }
      }
    }

    function handleFocus() {
      if (action.type === ActionType.Focus) {
        draft.focus = action.payload
      }
    }
  })
}

export interface State {
  defaultPlugin: PluginType
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  plugins: Record<PluginType, Plugin<any>>
  documents: Record<string, PluginState>
  focus?: string
}

export type Action = InsertAction | ChangeAction | RemoveAction | FocusAction

type PluginType = string

export interface InsertAction {
  type: ActionType.Insert
  payload: {
    id: string
  } & Partial<PluginState>
}

export interface ChangeAction {
  type: ActionType.Change
  payload: {
    id: string
    state: unknown
  }
}

export interface RemoveAction {
  type: ActionType.Remove
  payload: string
}

export interface FocusAction {
  type: ActionType.Focus
  payload: string
}

export interface PluginState {
  plugin: PluginType
  state?: unknown
}

/** Selectors */
export function getDocuments(state: State): Record<string, PluginState> {
  return state.documents
}

export function getDocument(state: State, id: string): PluginState | null {
  return getDocuments(state)[id] || null
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getPlugin<S = any>(
  state: State,
  type: string
): Plugin<S> | null {
  const plugins = getPlugins(state)

  return plugins[type] || null
}

export function getDefaultPlugin(state: State): PluginType {
  return state.defaultPlugin
}

export function getPlugins<K extends string = string>(
  state: State
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): Record<K, Plugin<any>> {
  return state.plugins
}

export function isFocused(state: State, id: string): boolean {
  return state.focus === id
}
